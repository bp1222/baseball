import { GameStatusCode } from '@bp1222/stats-api'

export enum GameStatus {
  Final,
  Postponed,
  Scheduled,
  InProgress,
  Challenge,
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
    case GameStatusCode.Challenge:
      return GameStatus.Challenge
    case GameStatusCode.Canceled:
      return GameStatus.Canceled
    case GameStatusCode.Final:
    case GameStatusCode.GameOver:
      return GameStatus.Final
  }
}
