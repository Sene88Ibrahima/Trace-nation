# Configuration Supabase pour Trace Nation

## Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous ou créez un compte
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Nom du projet** : trace-nation (ou le nom de votre choix)
   - **Mot de passe de la base de données** : Choisissez un mot de passe fort
   - **Région** : Choisissez la région la plus proche de vos utilisateurs
5. Cliquez sur "Create new project"

### 2. Récupérer les credentials

Une fois le projet créé :

1. Allez dans **Settings** (⚙️) > **API**
2. Vous trouverez :
   - **Project URL** : `https://[votre-project-id].supabase.co`
   - **Project API keys** :
     - `anon` `public` : C'est votre clé publique (VITE_SUPABASE_PUBLISHABLE_KEY)

### 3. Mettre à jour le fichier .env

Copiez vos credentials dans le fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_PROJECT_ID="votre-project-id"
VITE_SUPABASE_URL="https://votre-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="votre-anon-key"
```

### 4. Configurer la base de données

Créez la table `user_roles` nécessaire pour l'authentification :

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Exécutez ce script :

```sql
-- Table pour les rôles des utilisateurs
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('citoyen', 'admin', 'administration')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- RLS (Row Level Security)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent lire leur propre rôle
CREATE POLICY "Users can read their own role"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique : Seuls les admins peuvent modifier les rôles
CREATE POLICY "Admins can manage roles"
  ON user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'administration')
    )
  );

-- Trigger pour créer automatiquement un rôle 'citoyen' pour les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'citoyen');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Configurer l'authentification email

1. Allez dans **Authentication** > **Providers** > **Email**
2. Activez **Enable Email provider**
3. Configurez les templates d'emails si nécessaire
4. Dans **URL Configuration**, ajoutez votre URL de redirect :
   - **Site URL** : `http://localhost:8080` (pour le développement)
   - **Redirect URLs** : Ajoutez `http://localhost:8080/**`

### 6. Redémarrer le serveur de développement

Après avoir mis à jour le fichier `.env`, redémarrez votre serveur :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez-le
npm run dev
```

## Vérification

Pour vérifier que tout fonctionne :

1. Ouvrez votre application sur `http://localhost:8080/register`
2. Essayez de créer un compte
3. Vous devriez recevoir un email de confirmation
4. Vérifiez dans le dashboard Supabase > **Authentication** > **Users** que l'utilisateur a été créé

## Dépannage

### Erreur "Failed to fetch" ou "ERR_NAME_NOT_RESOLVED"

- Vérifiez que le projet Supabase est actif (pas en pause)
- Vérifiez que les credentials dans `.env` sont corrects
- Vérifiez votre connexion internet
- Assurez-vous d'avoir redémarré le serveur de développement après avoir modifié `.env`

### L'utilisateur ne reçoit pas d'email

- Vérifiez les paramètres SMTP dans Supabase
- En développement, les emails peuvent être bloqués - vérifiez les logs Supabase

### Problèmes de rôles

- Vérifiez que le trigger `on_auth_user_created` fonctionne
- Vérifiez manuellement dans la table `user_roles` que les rôles sont créés
