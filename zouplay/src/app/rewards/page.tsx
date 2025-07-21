'use client'

import { useAuth } from '@/hooks/useAuth'
import { RewardService } from '@/services/rewardService'
import { Reward } from '@/types/database'
import { formatPoints } from '@/lib/utils'
import { Gift, ShoppingCart, Star, Package, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RewardsPage() {
  const { user, loading, refreshUser } = useAuth()
  const router = useRouter()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loadingRewards, setLoadingRewards] = useState(true)
  const [purchasingReward, setPurchasingReward] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadRewards()
    }
  }, [user])

  const loadRewards = async () => {
    try {
      const rewardService = new RewardService()
      const rewardsData = await rewardService.getRewards()
      setRewards(rewardsData)
    } catch (error) {
      console.error('Error loading rewards:', error)
    } finally {
      setLoadingRewards(false)
    }
  }

  const handlePurchaseReward = async (rewardId: string) => {
    if (!user || purchasingReward) return

    try {
      setPurchasingReward(rewardId)
      const rewardService = new RewardService()
      
      await rewardService.purchaseReward(user.id, rewardId)
      
      // Refresh user points and rewards
      await refreshUser()
      await loadRewards()
      
      alert('Récompense achetée avec succès ! 🎉')
      
    } catch (error) {
      console.error('Error purchasing reward:', error)
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'achat')
    } finally {
      setPurchasingReward(null)
    }
  }

  const canAfford = (reward: Reward) => {
    return user ? user.total_points >= reward.points_required : false
  }

  const isOutOfStock = (reward: Reward) => {
    return reward.stock_quantity !== null && reward.stock_quantity <= 0
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
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Gift className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Boutique de récompenses
            </h1>
            <p className="text-green-100 mb-4">
              Échangez vos points contre des récompenses exclusives
            </p>
            <div className="bg-white/10 rounded-lg px-4 py-2 inline-block">
              <span className="text-lg font-semibold">
                {formatPoints(user.total_points)} points disponibles
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingRewards ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : rewards.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune récompense disponible
            </h3>
            <p className="text-gray-500">
              Les récompenses arrivent bientôt !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const affordable = canAfford(reward)
              const outOfStock = isOutOfStock(reward)
              const isPurchasing = purchasingReward === reward.id

              return (
                <div key={reward.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Reward Image */}
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
                    {reward.image_url ? (
                      <img 
                        src={reward.image_url} 
                        alt={reward.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Gift className="w-16 h-16 text-white" />
                    )}
                    
                    {outOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Rupture de stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {reward.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {reward.description}
                    </p>

                    {/* Stock Info */}
                    {reward.stock_quantity !== null && (
                      <div className="flex items-center space-x-1 mb-4 text-sm text-gray-500">
                        <Package className="w-4 h-4" />
                        <span>Stock: {reward.stock_quantity}</span>
                      </div>
                    )}

                    {/* Points Required */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {formatPoints(reward.points_required)}
                        </span>
                        <span className="text-sm text-gray-500">points</span>
                      </div>
                      
                      {!affordable && (
                        <div className="flex items-center space-x-1 text-red-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Insuffisant</span>
                        </div>
                      )}
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={() => handlePurchaseReward(reward.id)}
                      disabled={!affordable || outOfStock || isPurchasing}
                      className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                        affordable && !outOfStock && !isPurchasing
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isPurchasing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Achat...</span>
                        </>
                      ) : outOfStock ? (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          <span>Rupture de stock</span>
                        </>
                      ) : affordable ? (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Acheter</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          <span>Points insuffisants</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Shop Info */}
        <div className="mt-12 bg-green-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-4">
            Comment ça marche ?
          </h2>
          <div className="space-y-2 text-green-800 text-sm">
            <p>• Gagnez des points en jouant aux mini-jeux</p>
            <p>• Échangez vos points contre des récompenses exclusives</p>
            <p>• Certaines récompenses ont un stock limité</p>
            <p>• Les points dépensés sont définitivement retirés de votre compte</p>
            <p>• Les achats sont immédiats et ne peuvent pas être annulés</p>
          </div>
        </div>
      </div>
    </div>
  )
}