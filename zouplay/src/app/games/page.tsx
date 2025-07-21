'use client'

import { useAuth } from '@/hooks/useAuth'
import { GameService } from '@/services/gameService'
import { MiniGame, GameSession } from '@/types/database'
import { formatPoints } from '@/lib/utils'
import { Play, Clock, Trophy, CheckCircle } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function GamesPage() {
  const { user, loading, refreshUser } = useAuth()
  const router = useRouter()
  const [games, setGames] = useState<MiniGame[]>([])
  const [gameSessions, setGameSessions] = useState<GameSession[]>([])
  const [loadingGames, setLoadingGames] = useState(true)
  const [playingGame, setPlayingGame] = useState<string | null>(null)

  const loadGames = useCallback(async () => {
    if (!user) return
    
    try {
      const gameService = new GameService()
      const [gamesData, sessionsData] = await Promise.all([
        gameService.getMiniGames(),
        gameService.getGameSessions(user.id)
      ])
      
      setGames(gamesData)
      setGameSessions(sessionsData)
    } catch (error) {
      console.error('Error loading games:', error)
    } finally {
      setLoadingGames(false)
    }
  }, [user])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadGames()
    }
  }, [user, loadGames])

  const handlePlayGame = async (gameId: string) => {
    if (!user || playingGame) return

    try {
      setPlayingGame(gameId)
      const gameService = new GameService()
      
      // Simulate game play (in a real app, this would be the actual game logic)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      await gameService.playGame(user.id, gameId)
      
      // Refresh user points and game sessions
      await refreshUser()
      await loadGames()
      
      // Show success message (you could add a toast notification here)
      alert('Félicitations ! Vous avez gagné des points !')
      
    } catch (error) {
      console.error('Error playing game:', error)
      alert(error instanceof Error ? error.message : 'Erreur lors du jeu')
    } finally {
      setPlayingGame(null)
    }
  }

  const getGameSession = (gameId: string) => {
    return gameSessions.find(session => session.gameId === gameId)
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
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Mini-jeux
            </h1>
            <p className="text-gray-600">
              Jouez et gagnez des points chaque jour !
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingGames ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun jeu disponible
            </h3>
            <p className="text-gray-500">
              Les mini-jeux arriveront bientôt !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const session = getGameSession(game.id)
              const canPlay = session?.canPlay ?? true
              const hasPlayedToday = session?.hasPlayedToday ?? false
              const isPlaying = playingGame === game.id

              return (
                <div key={game.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Game Header */}
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {game.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {game.description}
                    </p>

                    {/* Points Reward */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {formatPoints(game.points_reward)} points
                        </span>
                      </div>
                      
                      {hasPlayedToday && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Joué</span>
                        </div>
                      )}
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => handlePlayGame(game.id)}
                      disabled={!canPlay || isPlaying}
                      className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                        canPlay && !isPlaying
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>En cours...</span>
                        </>
                      ) : canPlay ? (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Jouer</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Déjà joué aujourd&apos;hui</span>
                        </>
                      )}
                    </button>

                    {!canPlay && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Revenez demain pour rejouer !
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Game Rules */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Règles du jeu
          </h2>
          <div className="space-y-2 text-blue-800 text-sm">
            <p>• Vous pouvez jouer à chaque mini-jeu une fois par jour</p>
            <p>• Gagnez des points en fonction de la difficulté du jeu</p>
            <p>• Utilisez vos points dans la boutique pour obtenir des récompenses</p>
            <p>• Plus vous jouez, plus vous montez dans le classement !</p>
          </div>
        </div>
      </div>
    </div>
  )
}