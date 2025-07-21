#!/bin/bash

# 🚀 Script de Déploiement ZouPlay sur Vercel

echo "🎮 Déploiement ZouPlay..."

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Veuillez exécuter ce script depuis le répertoire zouplay"
    exit 1
fi

# Vérifier si les variables d'environnement sont présentes
if [ ! -f ".env.local" ]; then
    echo "⚠️  Attention: Fichier .env.local manquant"
    echo "📝 Créez-le avec vos clés Supabase avant de déployer"
    echo "📋 Voir .env.example pour le format"
    read -p "Continuer quand même ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 1. Vérifier que tout est commité
echo "📦 Vérification des changements Git..."
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Vous avez des changements non commités"
    read -p "Les commiter maintenant ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Message de commit: " commit_message
        git commit -m "$commit_message"
    else
        echo "❌ Veuillez commiter vos changements avant de déployer"
        exit 1
    fi
fi

# 2. Test de build local
echo "🔨 Test de build local..."
if ! npm run build; then
    echo "❌ Erreur de build local - veuillez corriger avant de déployer"
    exit 1
fi

echo "✅ Build local réussi !"

# 3. Push vers GitHub
echo "📤 Push vers GitHub..."
current_branch=$(git branch --show-current)
git push origin $current_branch

# 4. Installer Vercel CLI si nécessaire
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# 5. Déployer sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo ""
echo "🎉 Déploiement terminé !"
echo "🌐 Votre application est maintenant en ligne !"
echo ""
echo "📋 N'oubliez pas de :"
echo "   1. Configurer les variables d'environnement sur Vercel"
echo "   2. Mettre à jour les URLs dans Supabase Auth"
echo "   3. Créer votre premier utilisateur admin"
echo ""
echo "📖 Voir DEPLOYMENT.md pour plus de détails"