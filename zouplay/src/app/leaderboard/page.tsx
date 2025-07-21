'use client'

import { useAuth } from '@/hooks/useAuth'
import { UserService } from '@/services/userService'
import { LeaderboardEntry } from '@/types/database'
import { formatPoints, getInitials } from '@/lib/utils'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LeaderboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadLeaderboard()
    }
  }, [user])

  const loadLeaderboard = async () => {
    try {
      const userService = new UserService()
      const [leaderboardData, rank] = await Promise.all([
        userService.getLeaderboard(50), // Top 50 users
        userService.getUserRank(user!.id)
      ])
      
      setLeaderboard(leaderboardData)
      setUserRank(rank)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">{rank}</span>
          </div>
        )
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600'
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600'
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
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Classement
            </h1>
            <p className="text-yellow-100">
              Découvrez les meilleurs joueurs de ZouPlay
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User's Current Rank */}
        {userRank && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Votre position
            </h2>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getRankBadgeColor(userRank)}`}>
                  <span className="font-bold">#{userRank}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.nom}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {formatPoints(user.total_points)}
                </p>
                <p className="text-sm text-gray-500">points</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Joueurs
            </h2>
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun classement disponible
              </h3>
              <p className="text-gray-500">
                Soyez le premier à jouer et à marquer des points !
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {leaderboard.map((entry, index) => {
                const isCurrentUser = entry.user.id === user.id
                
                return (
                  <div
                    key={entry.user.id}
                    className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      isCurrentUser ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* User Avatar */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                        entry.rank <= 3 ? getRankBadgeColor(entry.rank) : 'bg-gray-500'
                      }`}>
                        {getInitials(entry.user.nom)}
                      </div>

                      {/* User Info */}
                      <div>
                        <p className={`font-medium ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                          {entry.user.nom}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Vous
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {entry.user.email}
                        </p>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        entry.rank === 1 ? 'text-yellow-600' :
                        entry.rank === 2 ? 'text-gray-600' :
                        entry.rank === 3 ? 'text-amber-600' :
                        'text-gray-900'
                      }`}>
                        {formatPoints(entry.user.total_points)}
                      </p>
                      <p className="text-sm text-gray-500">points</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Leaderboard Info */}
        <div className="mt-8 bg-yellow-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">
            Comment gravir le classement ?
          </h3>
          <div className="space-y-2 text-yellow-800 text-sm">
            <p>• Jouez quotidiennement aux mini-jeux pour gagner des points</p>
            <p>• Plus un jeu est difficile, plus il rapporte de points</p>
            <p>• Le classement est mis à jour en temps réel</p>
            <p>• Seuls les points gagnés comptent, pas les points dépensés</p>
          </div>
        </div>
      </div>
    </div>
  )
}