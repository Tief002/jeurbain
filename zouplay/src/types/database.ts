export type UserRole = 'player' | 'admin'

export interface User {
  id: string
  email: string
  nom: string
  role: UserRole
  total_points: number
  created_at: string
}

export interface MiniGame {
  id: string
  title: string
  description: string
  points_reward: number
  is_active: boolean
  created_at: string
}

export interface Participation {
  id: string
  user_id: string
  game_id: string
  points_earned: number
  played_at: string
}

export interface Reward {
  id: string
  title: string
  description: string
  image_url?: string
  points_required: number
  is_available: boolean
  stock_quantity?: number
  created_at: string
}

export interface Purchase {
  id: string
  user_id: string
  reward_id: string
  points_spent: number
  redeemed_at: string
}

export interface LeaderboardEntry {
  user: User
  rank: number
}

export interface GameSession {
  gameId: string
  hasPlayedToday: boolean
  canPlay: boolean
}