'use client'

import { useAuth } from '@/hooks/useAuth'
import { Shield, Users, Gamepad2, Gift, Plus, BarChart3 } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    } else if (!loading && user && !isAdmin) {
      router.push('/')
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600">Vous n&apos;avez pas les permissions d&apos;administrateur.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Dashboard Administrateur
            </h1>
            <p className="text-red-100">
              Gérez les utilisateurs, jeux et récompenses de ZouPlay
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Utilisateurs</h3>
                <p className="text-sm text-gray-500">Gérer les comptes joueurs</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Voir tous les utilisateurs
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Ajouter des points manuellement
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Gérer les rôles
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mini-jeux</h3>
                <p className="text-sm text-gray-500">Créer et modifier les jeux</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                Voir tous les jeux
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                Créer un nouveau jeu
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                Désactiver/Activer jeux
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Récompenses</h3>
                <p className="text-sm text-gray-500">Gérer la boutique</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                Voir toutes les récompenses
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                Ajouter une récompense
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                Gérer les stocks
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Statistiques rapides
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">--</p>
              <p className="text-sm text-gray-500">Utilisateurs actifs</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">--</p>
              <p className="text-sm text-gray-500">Jeux disponibles</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">--</p>
              <p className="text-sm text-gray-500">Participations aujourd&apos;hui</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">--</p>
              <p className="text-sm text-gray-500">Achats ce mois</p>
            </div>
          </div>
        </div>

        {/* Development Note */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            🚧 Interface d&apos;administration en développement
          </h3>
          <p className="text-amber-800 text-sm mb-4">
            Cette page est le point d&apos;entrée du dashboard administrateur. Les fonctionnalités complètes peuvent être développées selon vos besoins spécifiques.
          </p>
          <div className="text-amber-800 text-sm space-y-1">
            <p><strong>Fonctionnalités à implémenter :</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Interface CRUD pour les mini-jeux</li>
              <li>Interface CRUD pour les récompenses</li>
              <li>Gestion des utilisateurs et attribution de points</li>
              <li>Tableaux de bord avec statistiques détaillées</li>
              <li>Filtres et recherche avancée</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}