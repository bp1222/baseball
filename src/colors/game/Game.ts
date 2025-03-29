import {Color} from "@mui/material"
import {blue, deepOrange, grey, lightBlue, lightGreen, orange, purple, red} from "@mui/material/colors"

import {GameResult} from "@/types/Series/GameResult.ts"

export const OppositeGameResult = (result: GameResult): GameResult => {
  switch (result) {
    case GameResult.Win:
      return GameResult.Loss
    case GameResult.Loss:
      return GameResult.Win
    default:
      return result
  }
}

export const DefaultGameResultColor = grey
export const GameResultColor: { [key in GameResult]: Color } = {
  [GameResult.Win]: lightGreen,
  [GameResult.Loss]: red,
  [GameResult.Tie]: blue,
  [GameResult.InProgress]: lightBlue,
  [GameResult.GameOver]: purple,
  [GameResult.Canceled]: deepOrange,
  [GameResult.Postponed]: orange,
  [GameResult.Unplayed]: DefaultGameResultColor,
}
