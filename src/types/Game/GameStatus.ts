import { GameStatusCode } from '@bp1222/stats-api'

export enum GameStatus {
  Final,
  Postponed,
  Scheduled,
  InProgress,
  Challenge,
  Canceled,
  Suspended,
}

/** Games that are live or paused mid-game and should use live score/linescore data. */
export const isGameLive = (status: GameStatus): boolean =>
  status === GameStatus.InProgress || status === GameStatus.Suspended

export const isGameSuspended = (status: GameStatus): boolean => status === GameStatus.Suspended

export const GameStatusFromMLBGameStatus = (
  codedState?: GameStatusCode | string,
  detailedState?: string,
): GameStatus => {
  if (codedState === 'U' || detailedState === 'Suspended') {
    return GameStatus.Suspended
  }

  switch (codedState) {
    case GameStatusCode.Scheduled:
    case GameStatusCode.Pregame:
      return GameStatus.Scheduled
    case GameStatusCode.Postponed:
      return GameStatus.Postponed
    case GameStatusCode.InProgress:
      return GameStatus.InProgress
    case GameStatusCode.Suspended:
      return GameStatus.Suspended
    case GameStatusCode.Challenge:
      return GameStatus.Challenge
    case GameStatusCode.Canceled:
      return GameStatus.Canceled
    case GameStatusCode.Final:
    case GameStatusCode.GameOver:
      return GameStatus.Final
    default:
      return GameStatus.Scheduled
  }
}
