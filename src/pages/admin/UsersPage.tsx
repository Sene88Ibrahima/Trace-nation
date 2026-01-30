import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User as UserIcon, Shield, Search, Plus, Pencil, Trash2, UserPlus, Mail, Calendar, UserCheck, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { RoleBadge } from '@/components/ui/role-badge';
import { RoleSelector } from '@/components/ui/role-selector';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Utilisation du type UserRole depuis useAuth
import { UserRole } from '@/contexts/AuthContext';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  password?: string; // Ajout du champ password optionnel pour la démo
}

// Données statiques pour la démo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@tracker.sn',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'superadmin',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    password: 'SuperAdmin123'
  },
  {
    id: '2',
    email: 'admin@tracker.sn',
    firstName: 'Admin',
    lastName: 'Tracker',
    role: 'admin',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    password: 'Admin123' // Note: En production, le mot de passe ne devrait JAMAIS être stocké en clair
  },
  {
    id: '3',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'citoyen',
    isActive: true,
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'guest@example.com',
    firstName: 'Invité',
    lastName: 'Utilisateur',
    role: 'citoyen',
    isActive: true,
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [userUpdates, setUserUpdates] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = mockUsers[0]; // L'utilisateur connecté (superadmin par défaut)

  // Onglets disponibles selon le rôle
  const tabs = [
    { id: 'users', name: 'Utilisateurs', component: <div>Gestion des utilisateurs</div> },
    ...(currentUser.role === 'superadmin' ? [
      { id: 'dashboard', name: 'Tableau de bord', component: <div>Tableau de bord (super admin uniquement)</div> },
      { id: 'budget', name: 'Allocations budgétaires', component: <div>Gestion des budgets (super admin uniquement)</div> },
      { id: 'payments', name: 'Gestion des paiements', component: <div>Gestion des paiements (super admin uniquement)</div> },
      { id: 'fraud', name: 'Détection des fraudes', component: <div>Détection des fraudes (super admin uniquement)</div> },
    ] : [])
  ];

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setUserUpdates(prev => ({
      ...prev,
      [userId]: { ...prev[userId], ...updates }
    }));
  };

  const handleSaveUser = (userId: string) => {
    const updates = userUpdates[userId];
    if (!updates) return;
    
    setIsLoading(true);

    // Mise à jour locale pour la démo
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...updates, updatedAt: new Date().toISOString() } : user
    ));
    
    setEditingUser(null);
    // Simuler un délai de requête
    setTimeout(() => {
      setUserUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[userId];
        return newUpdates;
      });

      toast({
        title: 'Succès (démo)',
        description: 'En production, cette action mettrait à jour l\'utilisateur dans la base de données',
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
      setIsLoading(true);
      // Simuler un délai de requête
      setTimeout(() => {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: false } : user
      ));
      
        toast({
          title: 'Succès (démo)',
          description: 'En production, cette action désactiverait l\'utilisateur dans la base de données',
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleActivateUser = (userId: string) => {
    setIsLoading(true);
    // Simuler un délai de requête
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: true } : user
      ));
    
      toast({
        title: 'Succès (démo)',
        description: 'En production, cette action activerait l\'utilisateur dans la base de données',
      });
      setIsLoading(false);
    }, 1000);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Récupérer l'utilisateur connecté (en mode démo, on utilise le premier utilisateur)
  const currentUserRole = mockUsers[0]?.role || 'user';
  const isSuperAdmin = currentUserRole === 'superadmin';
  const isAdmin = isSuperAdmin || currentUserRole === 'admin';

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            <p className="text-sm text-gray-500">
              Gérez les comptes utilisateurs et leurs autorisations
            </p>
          </div>
          <div className="flex space-x-2">
            {isSuperAdmin && (
              <Button asChild variant="outline">
                <Link to="/admin/create-admin" className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nouvel administrateur
                </Link>
              </Button>
            )}
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="#" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un utilisateur par nom ou email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(users.length * 0.2)}% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((users.filter(u => u.isActive).length / users.length) * 100)}% des utilisateurs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => u.role === 'admin' && u.isActive).length} actifs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière connexion</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.length > 0 
                ? format(new Date(Math.max(...users.map(u => new Date(u.lastLogin || u.createdAt).getTime()))), 'dd MMM yyyy', { locale: fr })
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => new Date(u.lastLogin || 0) > new Date(Date.now() - 86400000)).length} connexions aujourd'hui
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Inscription</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const isEditing = editingUser === user.id;
                const updates = userUpdates[user.id] || {};
                const userData = { ...user, ...updates };
                
                return (
                  <TableRow key={user.id} className={!userData.isActive ? 'bg-gray-50' : ''}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage src={userData.avatarUrl} alt={`${userData.firstName} ${userData.lastName}`} />
                          <AvatarFallback>
                            {userData.firstName?.[0]}{userData.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {userData.firstName} {userData.lastName}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-3.5 w-3.5 mr-1.5" />
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <RoleSelector
                          value={userData.role}
                          onChange={(role) => handleUpdateUser(user.id, { role })}
                        />
                      ) : (
                        <RoleBadge role={userData.role} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={userData.isActive ? 'default' : 'secondary'}> 
                        {userData.isActive ? 'Actif' : 'Désactivé'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {format(new Date(userData.createdAt), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {userData.lastLogin 
                          ? format(new Date(userData.lastLogin), 'dd MMM yyyy HH:mm', { locale: fr })
                          : 'Jamais'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        {isEditing ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setEditingUser(null);
                                setUserUpdates(prev => {
                                  const newUpdates = { ...prev };
                                  delete newUpdates[user.id];
                                  return newUpdates;
                                });
                              }}
                            >
                              Annuler
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleSaveUser(user.id)}
                              disabled={!Object.keys(updates).length}
                            >
                              Enregistrer
                            </Button>
                          </>
                        ) : (
                          <>
                            {isAdmin && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setEditingUser(user.id)}
                                  disabled={!userData.isActive}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                {userData.isActive ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={user.role === 'admin'}
                                  >
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                    onClick={() => handleActivateUser(user.id)}
                                  >
                                    <UserCheck className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {!isLoading && filteredUsers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Affichage de <span className="font-medium">1</span> à{' '}
            <span className="font-medium">{Math.min(filteredUsers.length, 10)}</span> sur{' '}
            <span className="font-medium">{filteredUsers.length}</span> utilisateurs
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled={filteredUsers.length <= 10}>
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
