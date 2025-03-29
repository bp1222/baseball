import {Team} from "@bp1222/stats-api"

import {Series} from "@/types/Series.ts"
import {SeriesHomeAway} from "@/types/Series/SeriesHomeAway.ts"

export const GetHomeAway = (series: Series, team?: Team) => {
  if (team == undefined) {
    return SeriesHomeAway.Unknown
  }

  if (series.games.length == 0) {
    return SeriesHomeAway.Unknown
  }

  if (series.games[0].teams == undefined) {
    throw new Error("Game has no teams")
  }

  let isAway = false
  let isHome = false
  series.games.forEach((game) => {
    if (game.teams.home.team.id == team.id) {
      isHome = true
    }
    if (game.teams.away.team.id == team.id) {
      isAway = true
    }
  })

  if (isHome && isAway) {
    return SeriesHomeAway.Split
  }

  if (isHome) {
    return SeriesHomeAway.Home
  }

  if (isAway) {
    return SeriesHomeAway.Away
  }

  return SeriesHomeAway.Unknown
}
