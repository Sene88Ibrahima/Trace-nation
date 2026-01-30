import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/contexts/AuthContext';

export default function CreateAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simuler un délai de requête
      setTimeout(() => {
        // Créer un nouvel utilisateur admin
        const newAdmin = {
          id: Math.random().toString(36).substr(2, 9), // Générer un ID aléatoire
          email,
          firstName: fullName.split(' ')[0] || '',
          lastName: fullName.split(' ').slice(1).join(' ') || 'Admin',
          role: 'admin' as UserRole,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Dans une application réelle, on enverrait ces données à une API
        console.log('Nouvel administrateur créé (mode démo):', newAdmin);

        toast({
          title: 'Succès (démo)',
          description: 'En production, cela créerait un nouvel administrateur dans la base de données',
        });
        
        // Réinitialiser le formulaire
        setEmail('');
        setPassword('');
        setFullName('');
        
        // Rediriger vers la liste des utilisateurs
        navigate('/admin/users');
        
        setIsLoading(false);
      }, 1000);

      
    } catch (error) {
      console.error('Erreur lors de la simulation de création du compte admin:', error);
      toast({
        title: 'Erreur (démo)',
        description: 'Une erreur est survenue lors de la simulation',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Créer un compte administrateur</CardTitle>
            <CardDescription>
              Remplissez les champs ci-dessous pour créer un nouveau compte administrateur.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe (simulé en démo)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Retour
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Simulation en cours...' : 'Créer le compte (démo)'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
