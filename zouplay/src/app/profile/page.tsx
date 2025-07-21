'use client'

import { useAuth } from '@/hooks/useAuth'
import { UserService } from '@/services/userService'
import { RewardService } from '@/services/rewardService'
import { GameService } from '@/services/gameService'
import { formatPoints, formatDateTime, getInitials } from '@/lib/utils'
import { User, Edit3, Trophy, Gift, Gamepad2, Calendar, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserStats {
  totalGamesPlayed: number
  totalPointsEarned: number
  totalPurchases: number
  totalPointsSpent: number
  rank: number
}

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [recentPurchases, setRecentPurchases] = useState<any[]>([])
  const [recentParticipations, setRecentParticipations] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setNewName(user.nom)
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      const userService = new UserService()
      const rewardService = new RewardService()
      const gameService = new GameService()
      
      const [stats, purchases, participations] = await Promise.all([
        userService.getUserStats(user!.id),
        rewardService.getUserPurchases(user!.id),
        gameService.getUserParticipations(user!.id)
      ])

      setUserStats(stats)
      setRecentPurchases(purchases.slice(0, 5))
      setRecentParticipations(participations.slice(0, 5))
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleUpdateName = async () => {
    if (!user || !newName.trim()) return

    try {
      const userService = new UserService()
      await userService.updateUserProfile(user.id, { nom: newName.trim() })
      await refreshUser()
      setEditingName(false)
    } catch (error) {
      console.error('Error updating name:', error)
      alert('Erreur lors de la mise à jour du nom')
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">
                {getInitials(user.nom)}
              </span>
            </div>
            
            {/* Name */}
            <div className="flex items-center space-x-2 mb-2">
              {editingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-1 rounded-lg text-gray-900 text-xl font-bold"
                    onBlur={handleUpdateName}
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateName()}
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">{user.nom}</h1>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-white/80 hover:text-white"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-purple-100 mb-4">{user.email}</p>
            
            {/* Points */}
            <div className="bg-white/10 rounded-lg px-6 py-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span className="text-xl font-bold">
                  {formatPoints(user.total_points)} points
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {userStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Gamepad2 className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalGamesPlayed}</p>
              <p className="text-sm text-gray-500">Jeux joués</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">#{userStats.rank}</p>
              <p className="text-sm text-gray-500">Classement</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatPoints(userStats.totalPointsEarned)}</p>
              <p className="text-sm text-gray-500">Points gagnés</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalPurchases}</p>
              <p className="text-sm text-gray-500">Achats</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Participations */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Jeux récents
              </h2>
            </div>
            
            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : recentParticipations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun jeu joué récemment</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentParticipations.map((participation) => (
                  <div key={participation.id} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {(participation as any).mini_games?.title || 'Mini-jeu'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(participation.played_at)}
                      </p>
                    </div>
                    <div className="text-green-600 font-medium">
                      +{formatPoints(participation.points_earned)} pts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Purchases */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Achats récents
              </h2>
            </div>
            
            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : recentPurchases.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun achat récent</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {purchase.rewards?.title || 'Récompense'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(purchase.redeemed_at)}
                      </p>
                    </div>
                    <div className="text-red-600 font-medium">
                      -{formatPoints(purchase.points_spent)} pts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informations du compte
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Rôle</p>
              <p className="font-medium text-gray-900">
                {user.role === 'admin' ? 'Administrateur' : 'Joueur'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Membre depuis</p>
              <p className="font-medium text-gray-900">
                {formatDateTime(user.created_at)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Points totaux</p>
              <p className="font-medium text-gray-900">
                {formatPoints(user.total_points)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}