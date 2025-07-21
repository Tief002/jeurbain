# ⚡ Déploiement Rapide - ZouPlay

## 🚀 En 5 Minutes

### 1. **GitHub** (2 min)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. **Vercel** (2 min)
1. Aller sur [vercel.com](https://vercel.com)
2. **Import** votre repo GitHub `zouplay`
3. **Root Directory** : `zouplay`
4. **Add Environment Variables** :
   - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé anon
   - `SUPABASE_SERVICE_ROLE_KEY` = votre clé service role
   - `NEXT_PUBLIC_APP_NAME` = `ZouPlay`
5. **Deploy** 🚀

### 3. **Configuration** (1 min)
1. **Supabase Auth** → URL Configuration
   - Ajouter : `https://votre-app.vercel.app`
2. **Créer admin** (SQL) :
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'votre-email@example.com';
   ```

## ✅ C'est fini !

**Votre app** : `https://votre-app.vercel.app`

---

## 🔄 Redéploiement Automatique

Chaque `git push` = nouveau déploiement ! 

## 📖 Guide Complet

Voir `DEPLOYMENT.md` pour plus de détails.