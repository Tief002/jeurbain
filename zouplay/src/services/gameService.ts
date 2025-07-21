import { createClient } from '@/lib/supabase'
import { MiniGame, Participation, GameSession } from '@/types/database'

export class GameService {
  private supabase = createClient()

  async getMiniGames(): Promise<MiniGame[]> {
    const { data, error } = await this.supabase
      .from('mini_games')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async checkCanPlayToday(userId: string, gameId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await this.supabase
      .from('participations')
      .select('id')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .gte('played_at', `${today}T00:00:00.000Z`)
      .lt('played_at', `${today}T23:59:59.999Z`)

    if (error) throw error
    return !data || data.length === 0
  }

  async getGameSessions(userId: string): Promise<GameSession[]> {
    const games = await this.getMiniGames()
    const sessions: GameSession[] = []

    for (const game of games) {
      const canPlay = await this.checkCanPlayToday(userId, game.id)
      sessions.push({
        gameId: game.id,
        hasPlayedToday: !canPlay,
        canPlay
      })
    }

    return sessions
  }

  async playGame(userId: string, gameId: string): Promise<void> {
    const canPlay = await this.checkCanPlayToday(userId, gameId)
    if (!canPlay) {
      throw new Error('Vous avez déjà joué à ce jeu aujourd\'hui')
    }

    // Get the game points
    const { data: game, error: gameError } = await this.supabase
      .from('mini_games')
      .select('points_reward')
      .eq('id', gameId)
      .single()

    if (gameError) throw gameError

    // Record the participation
    const { error } = await this.supabase
      .from('participations')
      .insert({
        user_id: userId,
        game_id: gameId,
        points_earned: game.points_reward
      })

    if (error) throw error
  }

  async getUserParticipations(userId: string): Promise<Participation[]> {
    const { data, error } = await this.supabase
      .from('participations')
      .select(`
        *,
        mini_games (
          title,
          description
        )
      `)
      .eq('user_id', userId)
      .order('played_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getAllParticipations(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('participations')
      .select(`
        *,
        users (
          nom,
          email
        ),
        mini_games (
          title
        )
      `)
      .order('played_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Admin functions
  async createMiniGame(game: Omit<MiniGame, 'id' | 'created_at'>): Promise<MiniGame> {
    const { data, error } = await this.supabase
      .from('mini_games')
      .insert(game)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateMiniGame(id: string, updates: Partial<MiniGame>): Promise<MiniGame> {
    const { data, error } = await this.supabase
      .from('mini_games')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteMiniGame(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('mini_games')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}