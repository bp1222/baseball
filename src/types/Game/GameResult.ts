import {Color} from "@mui/material"
import {blue, grey, lightGreen, red} from "@mui/material/colors"

import {Game} from "@/types/Game.ts"
import {GameStatus} from "@/types/Game/GameStatus.ts"
import {Team} from "@/types/Team.ts"

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

export const GetGameResultColor = (game: Game, interested: Team): Color => {
  if (game.gameStatus == GameStatus.Final) {
    if (game.home.score > game.away.score) {
      if (game.home.teamId == interested.id) {
        return GameResultColors[GameResult.Win]
      } else {
        return GameResultColors[GameResult.Loss]
      }
    } else if (game.away.score > game.home.score) {
      if (game.away.teamId == interested.id) {
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