# 🚀 Guide de Déploiement Vercel - ZouPlay

## 📋 Étapes de Déploiement

### 1. 📤 Pousser sur GitHub

```bash
# Si vous n'avez pas encore initialisé git
git init
git add .
git commit -m "Initial commit: ZouPlay application"

# Créer un repo sur GitHub et le lier
git remote add origin https://github.com/votre-username/zouplay.git
git push -u origin main
```

### 2. 🔗 Connecter à Vercel

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Se connecter** avec votre compte GitHub
3. **Cliquer sur "New Project"**
4. **Importer votre repo** `zouplay` depuis GitHub
5. **Configurer le projet** :
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `zouplay`
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)

### 3. ⚙️ Configurer les Variables d'Environnement

Dans l'interface Vercel, section **Environment Variables** :

#### Variables Obligatoires :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://votre-projet.supabase.co` | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Clé anon de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Clé service role (admin) |
| `NEXT_PUBLIC_APP_NAME` | `ZouPlay` | Nom de l'application |

#### Comment trouver vos clés Supabase :

1. **Aller dans votre projet Supabase**
2. **Settings → API**
3. **Copier** :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important** : La `service_role` key doit rester secrète !

### 4. 🚀 Déployer

1. **Cliquer sur "Deploy"**
2. **Attendre** le build (2-5 minutes)
3. **Votre app sera disponible** sur `https://votre-projet.vercel.app`

### 5. 🔧 Configuration Post-Déploiement

#### A. Configurer l'URL dans Supabase Auth

1. **Supabase Dashboard → Authentication → URL Configuration**
2. **Ajouter votre domaine Vercel** :
   - **Site URL** : `https://votre-projet.vercel.app`
   - **Redirect URLs** : `https://votre-projet.vercel.app/**`

#### B. Mettre à jour l'URL dans votre app

Dans Vercel, **mettre à jour la variable** :
- `NEXT_PUBLIC_APP_URL` = `https://votre-projet.vercel.app`

#### C. Créer votre premier admin

1. **S'inscrire** via l'interface web
2. **Dans Supabase SQL Editor** :
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'votre-email@example.com';
   ```

## 🎯 Tests Post-Déploiement

### ✅ Checklist de Vérification

- [ ] **Page d'auth** charge correctement
- [ ] **Inscription** fonctionne
- [ ] **Connexion** fonctionne  
- [ ] **Dashboard** affiche les données
- [ ] **Mini-jeux** sont jouables
- [ ] **Boutique** permet les achats
- [ ] **Classement** s'affiche
- [ ] **Profil** est modifiable
- [ ] **Admin dashboard** (si admin) est accessible

### 🐛 Résolution de Problèmes

#### Erreur d'authentification
```
- Vérifier les URLs dans Supabase Auth
- Vérifier les variables d'environnement
- Check les logs Vercel
```

#### Erreur de base de données
```
- Vérifier que le schema SQL a été exécuté
- Vérifier les politiques RLS
- Check la connectivité Supabase
```

#### Erreur de build
```
- Check les logs de build Vercel
- Vérifier les dépendances npm
- Tester en local d'abord
```

## 🔄 Déploiements Automatiques

Une fois configuré, **chaque push sur `main`** redéploiera automatiquement !

```bash
# Faire des changements
git add .
git commit -m "Amélioration: nouvelle fonctionnalité"
git push origin main
# → Déploiement automatique !
```

## 🌐 Domaine Personnalisé (Optionnel)

### Avec un domaine que vous possédez :

1. **Vercel Dashboard → Settings → Domains**
2. **Ajouter votre domaine** : `zouplay.com`
3. **Configurer les DNS** selon les instructions Vercel
4. **Mettre à jour Supabase Auth** avec le nouveau domaine

## 📊 Monitoring et Analytics

### Vercel Analytics (Gratuit)
- **Dashboard Vercel** → Analytics
- **Métriques** : Visites, performance, erreurs

### Supabase Analytics
- **Dashboard Supabase** → Reports
- **Métriques** : Requêtes DB, auth, API

## 🔐 Sécurité en Production

### Variables d'Environnement
- ✅ **Jamais** commit les `.env.local`
- ✅ **Utiliser** Vercel Environment Variables
- ✅ **Régénérer** les clés si compromises

### Supabase RLS
- ✅ **Politiques** activées sur toutes les tables
- ✅ **Tests** des permissions utilisateur
- ✅ **Audit** régulier des accès

## 🚀 Commandes Utiles

```bash
# Build local (pour tester avant deploy)
npm run build

# Lancer en mode production local
npm start

# Voir les logs Vercel
vercel logs

# Redéployer manuellement
vercel --prod
```

---

## 🎉 Félicitations !

Votre application **ZouPlay** est maintenant **en ligne** et accessible au monde entier ! 

**URL de production** : `https://votre-projet.vercel.app`

### 📈 Prochaines Étapes

1. **Partager** l'URL avec vos utilisateurs
2. **Monitorer** les métriques Vercel/Supabase  
3. **Collecter** les feedbacks utilisateurs
4. **Itérer** et améliorer l'application

**ZouPlay est prêt pour la production ! 🎮✨**