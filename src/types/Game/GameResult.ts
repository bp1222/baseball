import { Game } from '@/types/Game'
import { GameStatus } from '@/types/Game/GameStatus'

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
