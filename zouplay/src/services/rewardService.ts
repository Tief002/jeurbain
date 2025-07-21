import { createClient } from '@/lib/supabase'
import { Reward, Purchase } from '@/types/database'

export class RewardService {
  private supabase = createClient()

  async getRewards(): Promise<Reward[]> {
    const { data, error } = await this.supabase
      .from('rewards')
      .select('*')
      .eq('is_available', true)
      .order('points_required', { ascending: true })

    if (error) throw error
    return data || []
  }

  async purchaseReward(userId: string, rewardId: string): Promise<void> {
    // Get user's current points
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('total_points')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // Get reward details
    const { data: reward, error: rewardError } = await this.supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single()

    if (rewardError) throw rewardError

    // Check if user has enough points
    if (user.total_points < reward.points_required) {
      throw new Error('Points insuffisants pour cet achat')
    }

    // Check stock if applicable
    if (reward.stock_quantity !== null && reward.stock_quantity <= 0) {
      throw new Error('Récompense en rupture de stock')
    }

    // Record the purchase
    const { error: purchaseError } = await this.supabase
      .from('purchases')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        points_spent: reward.points_required
      })

    if (purchaseError) throw purchaseError

    // Update stock if applicable
    if (reward.stock_quantity !== null) {
      const { error: stockError } = await this.supabase
        .from('rewards')
        .update({ stock_quantity: reward.stock_quantity - 1 })
        .eq('id', rewardId)

      if (stockError) throw stockError
    }
  }

  async getUserPurchases(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('purchases')
      .select(`
        *,
        rewards (
          title,
          description,
          image_url
        )
      `)
      .eq('user_id', userId)
      .order('redeemed_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getAllPurchases(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('purchases')
      .select(`
        *,
        users (
          nom,
          email
        ),
        rewards (
          title,
          description
        )
      `)
      .order('redeemed_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Admin functions
  async createReward(reward: Omit<Reward, 'id' | 'created_at'>): Promise<Reward> {
    const { data, error } = await this.supabase
      .from('rewards')
      .insert(reward)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateReward(id: string, updates: Partial<Reward>): Promise<Reward> {
    const { data, error } = await this.supabase
      .from('rewards')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteReward(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('rewards')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async getAllRewards(): Promise<Reward[]> {
    const { data, error } = await this.supabase
      .from('rewards')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}