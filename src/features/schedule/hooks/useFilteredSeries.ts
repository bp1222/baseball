/**
 * Hook to filter and sort series for a given date
 *
 * Filters series that span the selected date and sorts them by:
 * 1. League (for playoff series)
 * 2. Game time (for future/current dates)
 * 3. Home team name (alphabetically)
 */

import dayjs from 'dayjs'
import { useMemo } from 'react'

import { useSchedule } from '@/queries/schedule'
import { useTeams } from '@/queries/team'
import { Series } from '@/types/Series'
import { SeriesType } from '@/types/Series/SeriesType'

type UseFilteredSeriesResult = {
  /** All series that span the selected date */
  allSeries: Series[]
  /** Series with a game on the selected date */
  seriesWithGameToday: Series[]
  /** Series in progress but without a game on the selected date */
  seriesInProgressOnly: Series[]
  /** Whether to show grouped sections (games today vs in progress) */
  showGroups: boolean
  /** Whether the schedule is loading */
  isPending: boolean
  /** Whether there was an error loading the schedule */
  isError: boolean
  /** Refetch function for retry */
  refetch: () => void
}

export const useFilteredSeries = (selectedDate: dayjs.Dayjs | undefined): UseFilteredSeriesResult => {
  const { data: seasonSeries, isPending, isError, refetch } = useSchedule()
  const { data: teams } = useTeams()

  const allSeries = useMemo(() => {
    if (!seasonSeries?.length || !selectedDate) return []

    return seasonSeries
      .filter((s) => selectedDate.isBetween(dayjs(s.startDate), dayjs(s.endDate), 'day', '[]'))
      .sort((a, b) => {
        const aHome = teams?.find((t) => t.id === a.games[0].home.teamId)
        const bHome = teams?.find((t) => t.id === b.games[0].home.teamId)

        // Sort playoff series by league
        const playoffTypes = [SeriesType.WildCard, SeriesType.Division, SeriesType.League, SeriesType.World]
        if (playoffTypes.includes(a.type)) {
          if (aHome?.league && bHome?.league) {
            return aHome.league < bHome.league ? -1 : 1
          }
        }

        // For current/future dates, sort by game time
        if (!selectedDate.isBefore(dayjs(), 'day')) {
          const aGame = a.games.find((g) => selectedDate.isSame(dayjs(g.gameDate), 'day'))
          const bGame = b.games.find((g) => selectedDate.isSame(dayjs(g.gameDate), 'day'))

          if (aGame && bGame) {
            if (aGame.gameDate < bGame.gameDate) return -1
            if (aGame.gameDate > bGame.gameDate) return 1
          }
        }

        // Fall back to alphabetical by home team name
        return aHome?.name.localeCompare(bHome?.name ?? '') ?? 0
      })
  }, [seasonSeries, teams, selectedDate])

  const seriesWithGameToday = useMemo(() => {
    if (!selectedDate) return []
    return allSeries.filter((s) => s.games.some((g) => selectedDate.isSame(dayjs(g.gameDate), 'day')))
  }, [allSeries, selectedDate])

  const seriesInProgressOnly = useMemo(() => {
    if (!selectedDate) return []
    return allSeries.filter((s) => !s.games.some((g) => selectedDate.isSame(dayjs(g.gameDate), 'day')))
  }, [allSeries, selectedDate])

  const showGroups = seriesWithGameToday.length > 0 && seriesInProgressOnly.length > 0

  return {
    allSeries,
    seriesWithGameToday,
    seriesInProgressOnly,
    showGroups,
    isPending,
    isError,
    refetch,
  }
}
