import { createClient } from '@/lib/supabase'
import { User, LeaderboardEntry } from '@/types/database'

export class UserService {
  private supabase = createClient()

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(limit)

    if (error) throw error

    return (data || []).map((user, index) => ({
      user,
      rank: index + 1
    }))
  }

  async getUserRank(userId: string): Promise<number> {
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('total_points')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    const { count, error } = await this.supabase
      .from('users')
      .select('id', { count: 'exact' })
      .gt('total_points', user.total_points)

    if (error) throw error

    return (count || 0) + 1
  }

  async updateUserProfile(userId: string, updates: { nom?: string }): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Admin functions
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async updateUserRole(userId: string, role: 'player' | 'admin'): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async addPointsToUser(userId: string, points: number, reason: string = 'Ajout manuel'): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({ 
        total_points: this.supabase.raw(`total_points + ${points}`)
      })
      .eq('id', userId)

    if (error) throw error

    // Log the manual addition as a participation (optional)
    // You could create a special "manual" game type for tracking
  }

  async resetUserPoints(userId: string): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .update({ total_points: 0 })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error
  }

  async getUserStats(userId: string): Promise<{
    totalGamesPlayed: number
    totalPointsEarned: number
    totalPurchases: number
    totalPointsSpent: number
    rank: number
  }> {
    const [participations, purchases, rank] = await Promise.all([
      this.supabase
        .from('participations')
        .select('points_earned')
        .eq('user_id', userId),
      this.supabase
        .from('purchases')
        .select('points_spent')
        .eq('user_id', userId),
      this.getUserRank(userId)
    ])

    const totalGamesPlayed = participations.data?.length || 0
    const totalPointsEarned = participations.data?.reduce((sum, p) => sum + p.points_earned, 0) || 0
    const totalPurchases = purchases.data?.length || 0
    const totalPointsSpent = purchases.data?.reduce((sum, p) => sum + p.points_spent, 0) || 0

    return {
      totalGamesPlayed,
      totalPointsEarned,
      totalPurchases,
      totalPointsSpent,
      rank
    }
  }
}