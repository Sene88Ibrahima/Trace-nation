import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Shield, UserPlus, User, Home, Info, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user, role } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur TraceNation",
    });
    navigate('/');
  };


  // Définition des liens de navigation
  const navLinks = [
    { 
      name: "Accueil", 
      path: "/", 
      roles: ['citoyen', 'superadmin', 'admin'],
      icon: Home
    },
    { 
      name: "À propos", 
      path: "/about", 
      roles: ['citoyen', 'superadmin', 'admin'],
      icon: Info
    },
    // Lien visible uniquement pour les citoyens
    ...(role === 'citoyen' ? [{
      name: "Portail Citoyen", 
      path: "/citizen-portal",
      icon: Shield,
      requiresAuth: true
    }] : []),
    // Lien visible uniquement pour les administrateurs
    // (supprimé selon la demande de l'utilisateur)
  ];

  // Liens d'administration (supprimés selon la demande de l'utilisateur)

  const authLinks = [
    { 
      name: "Connexion", 
      path: "/login", 
      icon: LogIn,
      showWhenLoggedIn: false 
    },
    { 
      name: "Inscription", 
      path: "/register", 
      icon: UserPlus,
      showWhenLoggedIn: false
    },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">TraceNation</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex sm:space-x-2">
              {/* Liens de navigation principaux */}
              {navLinks
                .filter(link => !link.roles || link.roles.includes(role || 'guest'))
                .map((item) => {
                  const isActive = location.pathname === item.path;
                  const isDisabled = item.requiresAuth && !isAuthenticated;
                  
                  return (
                    <Link
                      key={item.path}
                      to={isDisabled ? '/login' : item.path}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-green-600 text-white"
                          : isDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                      }`}
                      onClick={(e) => {
                        if (isDisabled) {
                          e.preventDefault();
                          navigate('/login', { state: { from: item.path } });
                        }
                      }}
                    >
                      {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                      {item.name}
                    </Link>
                  );
                })}
              
              {/* Liens d'administration supprimés selon la demande */}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <span className="hidden md:inline">
                        {user?.email?.split('@')[0] || 'Mon compte'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Mon Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex space-x-2">
                {authLinks
                  .filter(item => !isAuthenticated || item.showWhenLoggedIn)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`${
                          location.pathname === item.path
                            ? 'bg-green-600 text-white'
                            : 'text-green-600 hover:bg-green-50'
                        } inline-flex items-center px-3 py-2 rounded-md text-sm font-medium border border-green-600`}
                      >
                        {Icon && <Icon className="h-4 w-4 mr-1" />}
                        {item.name}
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;