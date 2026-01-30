import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Shield, Building2 } from 'lucide-react';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && role !== 'admin') {
      navigate('/dashboard');
    }
  }, [role, authLoading, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, created_at');

    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (profiles && roles) {
      const usersWithRoles = profiles.map(profile => {
        const userRole = roles.find(r => r.user_id === profile.id);
        // Convertir le rôle de la base de données vers le format de l'interface utilisateur
        const uiRole = userRole?.role === 'administration' ? 'superadmin' : (userRole?.role || 'citoyen');
        
        return {
          id: profile.id,
          email: '', // L'email n'est pas disponible dans la table profiles
          full_name: profile.full_name || 'N/A',
          role: uiRole,
          created_at: profile.created_at,
        };
      });
      setUsers(usersWithRoles);
    }
    setLoading(false);
  };

  const updateUserRole = async (userId: string, role: string) => {
    // Vérifier que le rôle est valide
    const validRoles = ['admin', 'superadmin', 'citoyen'];
    
    if (!validRoles.includes(role)) {
      toast({
        title: "Erreur",
        description: "Rôle invalide",
        variant: "destructive",
      });
      return;
    }
    
    // Convertir le rôle pour la base de données
    const dbRole = (role === 'superadmin' ? 'administration' : role) as 'admin' | 'citoyen' | 'administration';
    
    const { error } = await supabase
      .from('user_roles')
      .update({ role: dbRole })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Rôle modifié avec succès",
      });
      fetchUsers();
    }
  };

  const getRoleBadge = (role: string) => {
    const config = {
      admin: { 
        variant: 'default' as const, 
        icon: Shield, 
        label: 'Administrateur' 
      },
      superadmin: { 
        variant: 'secondary' as const, 
        icon: Building2, 
        label: 'Super Admin' 
      },
      citoyen: { 
        variant: 'outline' as const, 
        icon: Users, 
        label: 'Citoyen' 
      },
    };
    const { variant, icon: Icon, label } = config[role] || config.citoyen;
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return <div>Chargement...</div>;
  }

  if (role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Gestion des Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle actuel</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="citoyen">Citoyen</SelectItem>
                          <SelectItem value="superadmin">SuperAdmin</SelectItem>
                          <SelectItem value="admin">Administrateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserManagement;
