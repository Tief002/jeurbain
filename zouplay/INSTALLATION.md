# Guide d'Installation ZouPlay 🎮

## Étapes de Configuration Rapide

### 1. Configuration Supabase

1. **Créer un projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Notez l'URL et la clé anon de votre projet

2. **Configurer la base de données**
   - Dans votre projet Supabase, allez dans l'éditeur SQL
   - Copiez et exécutez le contenu de `supabase/migrations/001_initial_schema.sql`
   - Cela créera toutes les tables, politiques RLS et données d'exemple

3. **Variables d'environnement**
   - Copiez `.env.local` et mettez vos vraies valeurs :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
   SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
   ```

### 2. Lancer l'application

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### 3. Créer un utilisateur admin

1. Inscrivez-vous via l'interface web
2. Dans l'éditeur SQL de Supabase :
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'votre-email@example.com';
   ```

## Test de l'Application

### Fonctionnalités Joueur
1. **Inscription/Connexion** : `/auth`
2. **Dashboard** : `/` - Voir vos stats et activité récente
3. **Mini-jeux** : `/games` - Jouer aux jeux (simulés avec timer de 2s)
4. **Classement** : `/leaderboard` - Voir le leaderboard
5. **Boutique** : `/rewards` - Acheter des récompenses
6. **Profil** : `/profile` - Gérer votre profil

### Fonctionnalités Admin
1. **Dashboard Admin** : `/admin` - Interface d'administration
2. Accessible uniquement aux utilisateurs avec `role = 'admin'`

## Architecture de l'Application

### Structure du Code
```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── auth/              # Page d'authentification
│   ├── games/             # Page des mini-jeux
│   ├── leaderboard/       # Page du classement
│   ├── rewards/           # Page de la boutique
│   ├── profile/           # Page du profil
│   └── admin/             # Dashboard admin
├── components/            # Composants React réutilisables
│   └── Layout/           # Navigation et layout
├── hooks/                 # Hooks React personnalisés
├── lib/                   # Utilitaires et configuration
├── services/              # Services API
└── types/                 # Types TypeScript
```

### Base de Données (Supabase)
- **PostgreSQL** avec Row Level Security (RLS)
- **Tables** : users, mini_games, participations, rewards, purchases
- **Triggers** automatiques pour la gestion des points
- **Politiques de sécurité** pour l'isolation des données

### Logique Métier
1. **Système de points** : Gagnés en jouant, dépensés dans la boutique
2. **Limitation quotidienne** : 1 participation par jeu par jour
3. **Classement temps réel** : Basé sur le total des points
4. **Gestion des stocks** : Pour les récompenses limitées

## Déploiement

### Vercel (Recommandé)
1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Variables d'environnement de production
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

## Technologies Utilisées

- **Frontend** : Next.js 14, React, TypeScript
- **UI** : TailwindCSS, Lucide React Icons
- **Backend** : Supabase (PostgreSQL + API REST)
- **Auth** : Supabase Auth avec SSR
- **Déploiement** : Vercel

## Fonctionnalités Implémentées ✅

### Rôle Joueur
- ✅ Authentification Supabase Auth
- ✅ Dashboard avec points et stats
- ✅ Mini-jeux avec limitation quotidienne
- ✅ Boutique de récompenses
- ✅ Classement des joueurs
- ✅ Profil utilisateur avec historique

### Rôle Admin
- ✅ Dashboard administrateur
- ✅ Protection par rôle
- ✅ Interface de base pour gestion
- 🚧 CRUD complet (structure prête)

### Architecture
- ✅ Base de données complète avec RLS
- ✅ Services API structurés
- ✅ Interface responsive mobile/desktop
- ✅ Navigation intuitive
- ✅ Types TypeScript complets

## Développement Futur

L'application est prête pour extensions :
- Interface CRUD admin complète
- Système de badges et achievements
- Événements temporaires
- Intégration de vrais mini-jeux
- Notifications push
- Analytics avancés

**ZouPlay est maintenant prêt à l'emploi ! 🚀**