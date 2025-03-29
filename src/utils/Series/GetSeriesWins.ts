import {GameStatusCode, Team} from "@bp1222/stats-api"

import {Series} from "@/types/Series.ts"

export const GetSeriesWins = (series: Series, team?: Team): number => {
  if (team == undefined) return 0

  return series.games.filter((game) =>
    [GameStatusCode.Final, GameStatusCode.GameOver].indexOf(game.status.codedGameState!) > -1 &&
    ((game.teams?.home.team.id == team.id && game.teams.home.isWinner) ||
      (game.teams?.away.team.id == team.id && game.teams.away.isWinner))).length
}
