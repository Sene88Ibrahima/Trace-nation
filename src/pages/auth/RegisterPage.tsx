import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, User, Mail, Lock, UserPlus, Shield, Settings } from "lucide-react";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast({
        title: "Conditions requises",
        description: "Veuillez accepter les conditions d'utilisation pour continuer.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const { error } = await signUp(formData.email, formData.password, fullName);
      
      if (error) throw error;
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Veuillez vérifier votre email pour confirmer votre compte.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white">
              <div className="flex flex-col h-full justify-center">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Rejoignez notre communauté</h2>
                  <p className="text-blue-100">Créez votre compte et accédez à tous nos services en quelques clics.</p>
                </div>
                
                <div className="space-y-4 mt-8">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Profil personnalisé</h4>
                      <p className="text-sm text-blue-100">Créez votre espace personnel</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Sécurisé et fiable</h4>
                      <p className="text-sm text-blue-100">Vos données sont protégées</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Facile à utiliser</h4>
                      <p className="text-sm text-blue-100">Interface intuitive et moderne</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 md:w-1/2">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h1>
                <p className="text-gray-500">Entrez vos informations pour vous inscrire</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      Prénom
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Votre prénom"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Nom
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Votre nom"
                        className="pl-10"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nom@exemple.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Le mot de passe doit contenir au moins 8 caractères
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, acceptTerms: !!checked }))
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      J'accepte les {" "}
                      <a href="/terms" className="text-blue-600 hover:underline">
                        conditions d'utilisation
                      </a>{" "}
                      et la {" "}
                      <a href="/privacy" className="text-blue-600 hover:underline">
                        politique de confidentialité
                      </a>
                    </label>
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                  {isLoading ? (
                    <span>Création du compte...</span>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Créer un compte</span>
                    </>
                  )}
                </Button>
                
                <p className="text-center text-sm text-gray-600 mt-4">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/login" className="font-medium text-blue-600 hover:underline">
                    Se connecter
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} TraceNation. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
