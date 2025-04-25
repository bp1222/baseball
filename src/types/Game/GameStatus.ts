import {GameStatusCode} from "@bp1222/stats-api"
import {Color} from "@mui/material"
import {blue, brown, deepPurple, grey} from "@mui/material/colors"

export enum GameStatus {
  Final,
  Postponed,
  Scheduled,
  InProgress,
  Canceled,
}

export const GameStatusFromMLBGameStatus = (status: GameStatusCode) => {
  switch (status) {
    case GameStatusCode.Scheduled:
    case GameStatusCode.Pregame:
      return GameStatus.Scheduled
    case GameStatusCode.Postponed:
      return GameStatus.Postponed
    case GameStatusCode.InProgress:
      return GameStatus.InProgress
    case GameStatusCode.Canceled:
      return GameStatus.Canceled
    case GameStatusCode.Final:
    case GameStatusCode.GameOver:
      return GameStatus.Final
  }
}

export const GetGameStatusColor = (status: GameStatus): Color => {
  switch (status) {
    case GameStatus.Scheduled:
      return grey
    case GameStatus.InProgress:
      return blue
    case GameStatus.Final:
      return grey
    case GameStatus.Postponed:
      return deepPurple
    case GameStatus.Canceled:
      return brown
  }
}