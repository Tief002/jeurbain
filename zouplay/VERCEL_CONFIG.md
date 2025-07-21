# ⚙️ Configuration Vercel pour ZouPlay

## 🔧 Paramètres de Build

### **Framework Preset**
```
Next.js
```
*(Détecté automatiquement)*

### **Root Directory**
```
zouplay
```
*(Car votre projet Next.js est dans le dossier zouplay)*

### **Build Command**
```
npm run build
```
*(Commande standard Next.js - NE PAS utiliser vercel-build)*

### **Output Directory**
```
.next
```
*(Répertoire de sortie Next.js - PAS public)*

### **Install Command**
```
npm install
```
*(Commande d'installation des dépendances)*

### **Development Command**
```
npm run dev
```
*(Pour le mode développement)*

---

## 🌍 Variables d'Environnement

### **Environment Variables à Ajouter :**

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://votre-projet.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_NAME` | `ZouPlay` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://votre-app.vercel.app` | Production |

### **Comment Récupérer les Clés Supabase :**

1. **Aller dans votre projet Supabase**
2. **Settings → API**
3. **Copier les valeurs** :

```
Project URL → NEXT_PUBLIC_SUPABASE_URL
anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
service_role → SUPABASE_SERVICE_ROLE_KEY
```

⚠️ **Important** : 
- La clé `service_role` doit rester **SECRÈTE**
- Cochez **Production, Preview, Development** pour toutes les variables

---

## 📱 Configuration Complète Interface Vercel

### **General Settings**
```
Project Name: zouplay (ou votre choix)
Framework: Next.js
Root Directory: zouplay
```

### **Build & Development Settings**
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### **Environment Variables**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL = https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration  
NEXT_PUBLIC_APP_NAME = ZouPlay
NEXT_PUBLIC_APP_URL = https://votre-app.vercel.app
```

### **Functions**
```
Node.js Version: 18.x (par défaut)
```

---

## ❌ Erreurs Communes à Éviter

### **Build Command**
- ❌ `npm run vercel-build` (n'existe pas dans ZouPlay)
- ✅ `npm run build`

### **Output Directory**
- ❌ `public` (pour sites statiques)
- ❌ `.` (racine)
- ✅ `.next` (Next.js standard)

### **Root Directory**
- ❌ `.` (si votre code est dans un sous-dossier)
- ✅ `zouplay` (nom de votre dossier projet)

### **Variables d'Environnement**
- ❌ Oublier le préfixe `NEXT_PUBLIC_` pour les variables client
- ❌ Exposer la `service_role` key côté client
- ✅ Bien séparer les variables publiques/privées

---

## 🚀 Étapes de Déploiement

### **1. Configuration Initiale**
```
1. Import GitHub Repository
2. Sélectionner votre repo zouplay
3. Root Directory: zouplay
4. Framework: Next.js (auto-détecté)
```

### **2. Variables d'Environnement**
```
Ajouter toutes les variables listées ci-dessus
Cocher: Production + Preview + Development
```

### **3. Deploy**
```
Cliquer sur "Deploy"
Attendre 2-5 minutes
```

### **4. Post-Deploy**
```
1. Copier l'URL Vercel générée
2. Mettre à jour NEXT_PUBLIC_APP_URL
3. Configurer Supabase Auth URLs
4. Créer votre premier admin
```

---

## 🔍 Vérification

### **Build Logs à Vérifier :**
```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### **Test Post-Déploiement :**
- [ ] Page d'accueil se charge
- [ ] Authentification fonctionne  
- [ ] Base de données accessible
- [ ] Variables d'environnement correctes

---

## 💡 Pro Tips

### **Performance**
- Vercel optimise automatiquement les images
- CDN global activé par défaut
- Compression automatique

### **Monitoring**
- Analytics Vercel gratuit
- Real User Monitoring
- Performance Insights

### **Domaine Personnalisé**
```
Settings → Domains
Ajouter: votre-domaine.com
Suivre les instructions DNS
```

**ZouPlay sera déployé avec une configuration optimale ! 🎮✨**