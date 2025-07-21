# ZouPlay 🎮

Une application web moderne de mini-jeux et récompenses construite avec Next.js, Supabase et TailwindCSS.

## ✨ Fonctionnalités

### 🧑‍🎮 Rôle Joueur
- **Authentification** : Inscription/Connexion obligatoire via Supabase Auth
- **Tableau de bord** : Points actuels, récompenses gagnées et classement
- **Mini-jeux** : Liste des jeux disponibles avec participation quotidienne
- **Boutique** : Échange des points contre des récompenses
- **Classement** : Leaderboard général des joueurs
- **Profil** : Gestion du profil et historique d'activité

### 🛠️ Rôle Admin
- **Dashboard privé** : Accessible uniquement aux admins
- **Gestion utilisateurs** : Visualisation et modification des profils
- **Gestion des jeux** : CRUD des mini-jeux
- **Gestion des récompenses** : CRUD des récompenses
- **Suivi des participations** : Filtrage par utilisateur, jeu, date
- **Attribution manuelle** : Ajout de points aux joueurs

## 🏗️ Architecture Technique

### Stack Technology
- **Frontend** : Next.js 14 avec App Router
- **UI** : TailwindCSS + Lucide React Icons
- **Authentification** : Supabase Auth avec SSR
- **Base de données** : PostgreSQL via Supabase
- **Backend** : Supabase (API REST + RLS)
- **Déploiement** : Prêt pour Vercel

### Structure des données
```sql
-- Tables principales
users (id, email, nom, role, total_points, created_at)
mini_games (id, title, description, points_reward, is_active, created_at)
participations (id, user_id, game_id, points_earned, played_at)
rewards (id, title, description, image_url, points_required, stock_quantity)
purchases (id, user_id, reward_id, points_spent, redeemed_at)
```

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ et npm
- Compte Supabase

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd zouplay
npm install
```

### 2. Configuration Supabase

#### Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL et la clé anon de votre projet

#### Exécuter les migrations
1. Dans votre projet Supabase, allez dans l'éditeur SQL
2. Copiez et exécutez le contenu de `supabase/migrations/001_initial_schema.sql`

### 3. Variables d'environnement
Créez un fichier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
NEXT_PUBLIC_APP_NAME=ZouPlay
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Lancer l'application
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📱 Interface Utilisateur

### Design System
- **Mobile-first** : Interface responsive optimisée mobile
- **Thème moderne** : Couleurs vives et interface gamifiée
- **Navigation intuitive** : Bottom nav mobile + sidebar desktop
- **Composants réutilisables** : Architecture modulaire

### Pages principales
- `/` : Tableau de bord utilisateur
- `/auth` : Authentification
- `/games` : Liste des mini-jeux
- `/leaderboard` : Classement des joueurs
- `/rewards` : Boutique de récompenses
- `/profile` : Profil utilisateur
- `/admin` : Dashboard administrateur (admins uniquement)

## 🔐 Sécurité et Permissions

### Row Level Security (RLS)
- Politiques de sécurité au niveau des lignes
- Isolation complète des données utilisateur
- Accès admin contrôlé par rôle

### Gestion des rôles
- **player** : Rôle par défaut pour tous les nouveaux utilisateurs
- **admin** : Défini manuellement dans la base de données

### Exemple pour créer un admin
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## 🎯 Logique Métier

### Système de points
- Les joueurs gagnent des points en jouant aux mini-jeux
- Une participation par jeu par jour maximum
- Les points sont automatiquement ajoutés au total
- Les achats déduisent automatiquement les points

### Gestion des stocks
- Les récompenses peuvent avoir un stock limité
- Le stock est décrémenté à chaque achat
- Les récompenses en rupture ne sont plus achetables

### Classement
- Basé sur le total des points de chaque utilisateur
- Mis à jour en temps réel
- Affichage des positions avec badges spéciaux (top 3)

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repo GitHub à Vercel
2. Ajoutez vos variables d'environnement
3. Déployez automatiquement

### Variables d'environnement de production
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

## 🔄 Extensions Possibles

### Fonctionnalités supplémentaires
- **Système de badges** : Récompenses pour achievements
- **Événements temporaires** : Jeux saisonniers avec bonus
- **Mode multijoueur** : Défis entre joueurs
- **Notifications push** : Rappels et nouveautés
- **Système de parrainage** : Points bonus pour invitations
- **API externe** : Jeux tiers intégrés

### Améliorations techniques
- **Cache Redis** : Pour les classements et stats
- **WebSockets** : Updates temps réel
- **CDN** : Pour les images de récompenses
- **Analytics** : Suivi d'engagement détaillé

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrez une issue GitHub
- Consultez la documentation Supabase
- Vérifiez les logs de développement

---

**ZouPlay** - Transformez le jeu en récompenses ! 🎮✨
