import { Game } from '@/types/Game'
import { GameStatus } from '@/types/Game/GameStatus'
import { Team } from '@/types/Team'

export enum GameResult {
  Unknown,
  Tie,

  // Status
  Home,
  Away,

  // Color
  Win,
  Loss,
}

export const GetGameResult = (game: Game, team?: Team): GameResult => {
  if (game.gameStatus !== GameStatus.Final) return GameResult.Unknown

  const homeScore = game.home.score ?? 0
  const awayScore = game.away.score ?? 0

  if (homeScore === awayScore) return GameResult.Tie

  const homeWins = homeScore > awayScore

  if (team == null) {
    return homeWins ? GameResult.Home : GameResult.Away
  }

  const teamWins = (homeWins && game.home.teamId === team.id) || (!homeWins && game.away.teamId === team.id)

  return teamWins ? GameResult.Win : GameResult.Loss
}
