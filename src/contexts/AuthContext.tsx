import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'superadmin' | 'citoyen';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateUser: (params: { email?: string; password?: string; data?: any }) => Promise<{ user: any; error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      const userRole = data?.role === 'administration' ? 'superadmin' : data?.role;
      setRole(userRole as UserRole || 'citoyen');
    } catch (error) {
      console.error('Error fetching role:', error);
      setRole('citoyen');
    }
  };

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setRole(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setRole(null);
    }
    return { error };
  };

  const updateUser = async ({ email, password, data }: { email?: string; password?: string; data?: any }) => {
    if (!user) return { user: null, error: new Error('Aucun utilisateur connecté') };

    try {
      let updateData: any = {};

      if (email) updateData.email = email;
      if (password) updateData.password = password;
      if (data) updateData.data = data;

      const { data: updatedUser, error } = await supabase.auth.updateUser(updateData);

      if (error) throw error;

      if (data?.role) {
        await supabase
          .from('user_roles')
          .upsert(
            { user_id: user.id, role: data.role },
            { onConflict: 'user_id' }
          );

        setRole(data.role);
      }

      return { user: updatedUser, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      return { user: null, error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      role,
      signUp,
      signIn,
      signOut,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
