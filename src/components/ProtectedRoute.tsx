import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
};

// Fonction utilitaire pour vérifier les autorisations basées sur les rôles
const hasRequiredRole = (userRole: UserRole | null, requiredRole?: UserRole, allowedRoles?: UserRole[]) => {
  console.log('Vérification des rôles:', { userRole, requiredRole, allowedRoles });
  
  // Si des rôles sont explicitement autorisés, on vérifie si le rôle de l'utilisateur est inclus
  if (allowedRoles && allowedRoles.length > 0) {
    return userRole ? allowedRoles.includes(userRole) : false;
  }
  
  // Si un rôle spécifique est requis, on vérifie ce rôle
  if (requiredRole) {
    if (!userRole) return false;
    
    // Vérification des rôles spécifiques
    if (requiredRole === 'admin') {
      return userRole === 'admin' || userRole === 'superadmin';
    }
    
    if (requiredRole === 'superadmin') {
      return userRole === 'superadmin';
    }
    
    return userRole === requiredRole;
  }
  
  // Si aucun rôle n'est requis, on autorise l'accès
  return true;
};

export const ProtectedRoute = ({ children, requiredRole, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    // Rediriger vers la page de connexion avec l'URL de redirection
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!hasRequiredRole(role, requiredRole, allowedRoles)) {
    // Rediriger vers la page non autorisée si l'utilisateur n'a pas le bon rôle
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
