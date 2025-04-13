import {Game, GameStatusCode, Team} from "@bp1222/stats-api"

import {GameResult} from "@/types/Series/GameResult.ts"

export const GetGameResult = (game: Game, team?: Team): GameResult => {
  if (game.teams == undefined) {
    throw new Error("Game has no teams")
  }

  switch (game.status.codedGameState) {
    case GameStatusCode.Canceled:
      return GameResult.Canceled
    case GameStatusCode.Postponed:
      return GameResult.Postponed
    case GameStatusCode.GameOver:
    case GameStatusCode.InProgress:
      return GameResult.InProgress
  }

  if (team == undefined) {
    return GameResult.Unplayed
  }

  if (game.teams.home.team.id == team.id) {
    if (game.teams.home.isWinner) {
      return GameResult.Win
    } else if (game.teams.away.isWinner) {
      return GameResult.Loss
    }
  } else if (game.teams.away.team.id == team.id) {
    if (game.teams.away.isWinner) {
      return GameResult.Win
    } else if (game.teams.home.isWinner) {
      return GameResult.Loss
    }
  }

  return GameResult.Unplayed
}
