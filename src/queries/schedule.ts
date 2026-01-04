import {GameType, Season} from "@bp1222/stats-api"
import {queryOptions, useQuery} from "@tanstack/react-query"

import {useSeason} from "@/queries/season.ts"
import {api} from "@/services/MlbAPI"
import {SeriesFromMLBSchedule} from "@/utils/GenerateSeasonSeries.ts"

export const scheduleOptions = (season?: Season) => queryOptions({
  queryKey: ['schedule', season?.seasonId],
  staleTime: 1000 * 60 * 60, // 1 hour
  enabled: !!season?.seasonId,
  queryFn: async () => {
    const data = await api.getSchedule({
      sportId: 1,
      gameTypes: [GameType.Regular, GameType.WildCardSeries, GameType.DivisionSeries, GameType.LeagueChampionshipSeries, GameType.WorldSeries],
      startDate: season!.seasonStartDate,
      endDate: season!.postSeasonEndDate ?? season!.seasonEndDate,
      fields: [
        "dates", "date", "name", "games", "gamePk", "status", "codedGameState", "gameType",
        "gameDate", "rescheduledFromData", "rescheduledToDate",
        "gamesInSeries", "seriesGameNumber",
        "teams", "away", "home", "isWinner", "seriesNumber", "score",
        "leagueRecord", "wins", "losses", "pct",
        "team", "id",
        "venue"
      ],
    })
    return SeriesFromMLBSchedule(data.dates.flatMap((d) => d.games))
  }
})

export const useSchedule = () => {
  const { data: season } = useSeason()
  return useQuery(scheduleOptions(season))
}