/**
 * Schedule Query
 *
 * Fetches and caches the full season schedule (all series).
 * This is the primary data source for both day view and team view.
 */

import { GameType } from '@bp1222/stats-api'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { SeriesFromMLBSchedule } from '@/domain/series/factory'
import { useSeason } from '@/queries/season'
import { useTeams } from '@/queries/team'
import { scheduleApi } from '@/services/MlbAPI'
import { Season } from '@/types/Season'
import { Team } from '@/types/Team'

/**
 * Stale time: 24 hours
 * Schedule structure (who plays when, series metadata) rarely changes.
 * Live scores are shown via linescore in GameTile (short stale + refetch when in progress).
 */
const SCHEDULE_STALE_TIME = 1000 * 60 * 60 * 24

/**
 * Fields requested for schedule/game endpoints
 */
const baseGameFields = [
  'dates',
  'date',
  'name',
  'games',
  'gamePk',
  'status',
  'codedGameState',
  'gameType',
  'gameDate',
  'rescheduledFromData',
  'rescheduledToDate',
  'gamesInSeries',
  'seriesGameNumber',
  'teams',
  'away',
  'home',
  'isWinner',
  'seriesNumber',
  'score',
  'leagueRecord',
  'wins',
  'losses',
  'pct',
  'team',
  'id',
  'venue',
]

export const scheduleOptions = (season?: Season, teams?: Team[]) =>
  queryOptions({
    queryKey: ['schedule', season?.seasonId],
    staleTime: SCHEDULE_STALE_TIME,
    enabled: !!(season?.seasonId && teams?.length),
    queryFn: async () => {
      const scheduleData = await scheduleApi.getSchedule({
        sportId: 1,
        gameTypes: [
          GameType.SpringTraining,
          GameType.Regular,
          GameType.WildCardSeries,
          GameType.DivisionSeries,
          GameType.LeagueChampionshipSeries,
          GameType.WorldSeries,
        ],
        startDate: season?.preSeasonStartDate ?? season?.seasonStartDate,
        endDate: season?.postSeasonEndDate ?? season?.seasonEndDate,
        fields: baseGameFields,
      })
      return SeriesFromMLBSchedule(
        scheduleData.dates.flatMap((d) => d.games),
        teams,
      )
    },
  })

export const useSchedule = () => {
  const { data: season } = useSeason()
  const { data: teams } = useTeams()

  return useQuery(scheduleOptions(season, teams))
}
