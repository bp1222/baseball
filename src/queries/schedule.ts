/**
 * Schedule Query
 *
 * Fetches and caches the full season schedule (all series).
 * This is the primary data source for both day view and team view.
 */

import { GameType, Season } from '@bp1222/stats-api'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { SeriesFromMLBSchedule } from '@/domain/series'
import { useSeason } from '@/queries/season'
import { api } from '@/services/MlbAPI'
import { TeamFromMLBTeam } from '@/types/Team'

/**
 * Stale time: 1 hour
 * Schedule data changes infrequently (game scores update, but structure doesn't).
 * For live score updates, components fetch linescore separately.
 */
const SCHEDULE_STALE_TIME = 1000 * 60 * 60

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

export const scheduleOptions = (season?: Season) =>
  queryOptions({
    queryKey: ['schedule', season?.seasonId],
    staleTime: SCHEDULE_STALE_TIME,
    enabled: !!season?.seasonId,
    queryFn: async () => {
      const [scheduleData, { teams: mlbTeams }] = await Promise.all([
        api.getSchedule({
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
        }),
        api.getTeams({
          sportId: 1,
          season: season!.seasonId,
          fields: [
            'teams',
            'id',
            'name',
            'teamName',
            'shortName',
            'abbreviation',
            'franchiseName',
            'league',
            'division',
            'nameShort',
            'springLeague',
          ],
          hydrate: 'division',
        }),
      ])
      const teams = mlbTeams.sort((a, b) => a.name.localeCompare(b.name) ?? 0).map((t) => TeamFromMLBTeam(t))
      return SeriesFromMLBSchedule(
        scheduleData.dates.flatMap((d) => d.games),
        teams,
      )
    },
  })

export const useSchedule = () => {
  const { data: season } = useSeason()
  return useQuery(scheduleOptions(season))
}
