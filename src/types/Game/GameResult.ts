import { Color } from '@mui/material'
import { blue, grey, lightGreen, red } from '@mui/material/colors'

import { Game } from '@/types/Game.ts'
import { GameStatus } from '@/types/Game/GameStatus.ts'
import { Team } from '@/types/Team.ts'

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

export type GameResultStatus = Exclude<GameResult, GameResult.Win | GameResult.Loss>
type GameResultColor = Exclude<GameResult, GameResult.Home | GameResult.Away>

export const DefaultGameResultColor: Color = grey
const GameResultColors: { [key in GameResultColor]: Color } = {
  [GameResult.Unknown]: DefaultGameResultColor,
  [GameResult.Win]: lightGreen,
  [GameResult.Loss]: red,
  [GameResult.Tie]: blue,
}

/** Key for muted dark-mode game tile/score colors */
export type GameTileDarkKey = 'win' | 'loss' | 'tie' | 'unknown' | 'inProgress' | 'canceled'

export type GameTileDarkColors = { bg: string; border: string; badgeBg: string; text: string }

/** Muted dark-mode colors for game tiles and score cells */
export const GameTileDarkColorsMap: Record<GameTileDarkKey, GameTileDarkColors> = {
  win: { bg: '#1a2e1a', border: '#2d4a2d', badgeBg: '#2d4a2d', text: '#b8d4b8' },
  loss: { bg: '#2e1a1a', border: '#4a2d2d', badgeBg: '#4a2d2d', text: '#d4b8b8' },
  tie: { bg: '#1a1a2e', border: '#2d2d4a', badgeBg: '#2d2d4a', text: '#b8b8d4' },
  // No team selected: slightly lighter than series card (grey[800]) so tile is discernible
  unknown: { bg: '#4a4a4a', border: '#5c5c5c', badgeBg: '#555555', text: '#e0e0e0' },
  inProgress: { bg: '#251a2e', border: '#3d2d4a', badgeBg: '#3d2d4a', text: '#d4b8e0' },
  canceled: { bg: '#2e251a', border: '#4a3d2d', badgeBg: '#4a3d2d', text: '#e0d4b8' },
}

/** Which dark color key to use for a game (for the interested team or overall). */
export function getGameTileDarkKey(game: Game, interestedTeam: Team | undefined): GameTileDarkKey {
  if (game.gameStatus === GameStatus.InProgress) return 'inProgress'
  if (game.gameStatus === GameStatus.Canceled) return 'canceled'
  if (game.gameStatus !== GameStatus.Final) return 'unknown'
  if (interestedTeam == null) return 'unknown'
  const homeWins = (game.home.score ?? 0) > (game.away.score ?? 0)
  const awayWins = (game.away.score ?? 0) > (game.home.score ?? 0)
  if ((game.home.score ?? 0) === (game.away.score ?? 0)) return 'tie'
  if (homeWins && game.home.teamId === interestedTeam.id) return 'win'
  if (awayWins && game.away.teamId === interestedTeam.id) return 'win'
  if (homeWins || awayWins) return 'loss'
  return 'unknown'
}

export const GetGameResult = (game: Game): GameResultStatus => {
  if (game.gameStatus == GameStatus.Final) {
    if (game.home.score > game.away.score) {
      return GameResult.Home
    } else if (game.away.score > game.home.score) {
      return GameResult.Away
    } else {
      return GameResult.Tie
    }
  }
  return GameResult.Unknown
}

export const GetGameResultColor = (game: Game, interested: Team | undefined): Color => {
  if (game.gameStatus == GameStatus.Final) {
    if (game.home.score > game.away.score) {
      if (game.home.teamId == interested?.id) {
        return GameResultColors[GameResult.Win]
      } else {
        return GameResultColors[GameResult.Loss]
      }
    } else if (game.away.score > game.home.score) {
      if (game.away.teamId == interested?.id) {
        return GameResultColors[GameResult.Win]
      } else {
        return GameResultColors[GameResult.Loss]
      }
    } else {
      return GameResultColors[GameResult.Tie]
    }
  }
  return GameResultColors[GameResult.Unknown]
}
