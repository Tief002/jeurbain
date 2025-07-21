'use client'

import { useAuth } from '@/hooks/useAuth'
import { UserService } from '@/services/userService'
import { GameService } from '@/services/gameService'
import { formatPoints, formatDate } from '@/lib/utils'
import { Trophy, TrendingUp, Star, Play, Gift } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserStats {
  totalGamesPlayed: number
  totalPointsEarned: number
  totalPurchases: number
  totalPointsSpent: number
  rank: number
}

interface RecentActivity {
  id: string
  type: 'game' | 'purchase'
  title: string
  points: number
  date: string
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      const userService = new UserService()
      const gameService = new GameService()
      
      const [stats, participations, purchases] = await Promise.all([
        userService.getUserStats(user!.id),
        gameService.getUserParticipations(user!.id),
        new Promise(resolve => resolve([])) // Placeholder for purchases
      ])

      setUserStats(stats)

      // Combine recent activity
      const activity: RecentActivity[] = [
        ...participations.slice(0, 3).map(p => ({
          id: p.id,
          type: 'game' as const,
          title: `Jeu: ${(p as any).mini_games?.title || 'Mini-jeu'}`,
          points: p.points_earned,
          date: p.played_at
        }))
      ]

      setRecentActivity(activity)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoadingStats(false)
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Bonjour, {user.nom} ! 👋
            </h1>
            <p className="text-blue-100 mb-6">
              Vous avez {formatPoints(user.total_points)} points
            </p>
            
            {userStats && (
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{userStats.totalGamesPlayed}</div>
                    <div className="text-sm text-blue-100">Jeux joués</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">#{userStats.rank}</div>
                    <div className="text-sm text-blue-100">Classement</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatPoints(userStats.totalPointsEarned)}</div>
                    <div className="text-sm text-blue-100">Points gagnés</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userStats.totalPurchases}</div>
                    <div className="text-sm text-blue-100">Achats</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Link
            href="/games"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Jouer</h3>
            <p className="text-sm text-gray-500">Mini-jeux</p>
          </Link>

          <Link
            href="/leaderboard"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Classement</h3>
            <p className="text-sm text-gray-500">Leaderboard</p>
          </Link>

          <Link
            href="/rewards"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Boutique</h3>
            <p className="text-sm text-gray-500">Récompenses</p>
          </Link>

          <Link
            href="/profile"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Profil</h3>
            <p className="text-sm text-gray-500">Mes infos</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Activité récente
          </h2>
          
          {loadingStats ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune activité récente</p>
              <p className="text-sm">Commencez à jouer pour voir votre activité ici !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'game' 
                        ? 'bg-blue-100' 
                        : 'bg-green-100'
                    }`}>
                      {activity.type === 'game' ? (
                        <Play className={`w-5 h-5 ${
                          activity.type === 'game' 
                            ? 'text-blue-600' 
                            : 'text-green-600'
                        }`} />
                      ) : (
                        <Gift className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    activity.type === 'game' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {activity.type === 'game' ? '+' : '-'}{formatPoints(activity.points)} pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
