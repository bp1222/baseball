import dayjs from "dayjs"

import {GameResult, GetGameResult} from "@/types/Game/GameResult.ts"
import {SeriesHomeAway} from "@/types/Series/SeriesHomeAway.ts"
import {SeriesResult} from "@/types/Series/SeriesResult.ts"
import {Team} from "@/types/Team.ts"

import {Game} from "./Game"
import {SeriesType} from "./Series/SeriesType"

export type Series = {
  pk: string
  type: SeriesType
  games: Game[]
  startDate?: dayjs.Dayjs
  endDate?: dayjs.Dayjs
}

export const GetSeriesHomeAway = (series: Series, team?: Team) => {
  if (team == undefined) {
    return SeriesHomeAway.Unknown
  }

  if (series.games.length == 0) {
    return SeriesHomeAway.Unknown
  }

  let isAway = false
  let isHome = false
  series.games.forEach((game) => {
    if (game.home.teamId == team.id) {
      isHome = true
    }
    if (game.away.teamId == team.id) {
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

export const GetSeriesWins = (series: Series, team: Team): number => {
  return series.games.filter((game) =>
    ((game.home.teamId == team.id) && (GetGameResult(game) == GameResult.Home)) ||
    ((game.away.teamId == team.id) && (GetGameResult(game) == GameResult.Away))).length
}

export const GetSeriesLosses = (series: Series, team: Team): number => {
  return series.games.filter((game) =>
    ((game.home.teamId == team.id) && (GetGameResult(game) == GameResult.Away)) ||
    ((game.away.teamId == team.id) && (GetGameResult(game) == GameResult.Home))).length
}

export const GetSeriesResult = (series: Series, team?: Team): SeriesResult => {
  if (team == undefined) {
    return SeriesResult.Unplayed
  }

  // games where home wins
  const wins = GetSeriesWins(series, team)
  const losses = GetSeriesLosses(series, team)

  if (losses != 0 || wins != 0) {
    const playedGames = losses + wins
    const gamesInSeries = series.games.length
    if (playedGames < gamesInSeries) {
      const det = Math.ceil((gamesInSeries + 1) / 2)
      return playedGames >= det
        ? wins >= det
          ? SeriesResult.Win
          : losses >= det
            ? SeriesResult.Loss
            : SeriesResult.InProgress
        : SeriesResult.InProgress
    } else {
      return losses == 0
        ? SeriesResult.Sweep
        : wins == 0
          ? SeriesResult.Swept
          : wins > losses
            ? SeriesResult.Win
            : wins == losses
              ? SeriesResult.Tie
              : SeriesResult.Loss
    }
  }

  return SeriesResult.Unplayed
}
