import {Team} from "@bp1222/stats-api"

import {Series} from "@/types/Series.ts"
import {SeriesResult} from "@/types/Series/SeriesResult.ts"
import {GetSeriesLosses} from "@/utils/Series/GetSeriesLosses.ts"
import {GetSeriesWins} from "@/utils/Series/GetSeriesWins.ts"

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
