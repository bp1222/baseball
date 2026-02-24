/**
 * Hook to calculate series statistics for a team
 *
 * Computes wins, losses, ties, winning percentage, last 10 results, and streak
 * from the team's regular season series.
 */

import { useMemo } from 'react'

import { calculateStreak, GetSeriesResult, seriesResultToChar } from '@/domain/series'
import { useSchedule } from '@/queries/schedule'
import { SeriesResult } from '@/types/Series/SeriesResult'
import { SeriesType } from '@/types/Series/SeriesType'
import { Team } from '@/types/Team'

type SeriesStats = {
  /** Number of series wins (including sweeps) */
  wins: number
  /** Number of series losses (including being swept) */
  losses: number
  /** Number of series ties */
  ties: number
  /** Series winning percentage (0-1) */
  pct: number
  /** Last 10 series results as W/L/T characters */
  last10: string[]
  /** Current streak (e.g., "W3", "L2", "T1") */
  streak: string
  /** Whether data is loading */
  isPending: boolean
  /** Whether there was an error */
  isError: boolean
  /** Refetch function */
  refetch: () => void
}

/**
 * Calculate series statistics for a team
 */
export const useSeriesStats = (team: Team | undefined): SeriesStats => {
  const { data: seasonSeries, isPending, isError, refetch } = useSchedule()

  const stats = useMemo(() => {
    if (!team || !seasonSeries) {
      return {
        wins: 0,
        losses: 0,
        ties: 0,
        pct: NaN,
        last10: [],
        streak: '',
      }
    }

    // Get regular season series results for this team
    const results = seasonSeries
      .filter((s) => s.type === SeriesType.Regular)
      .filter((s) => s.games.some((g) => g.away.teamId === team.id || g.home.teamId === team.id))
      .map((s) => GetSeriesResult(s, team))

    // Count wins, losses, ties
    const wins = results.filter((r) => r === SeriesResult.Win || r === SeriesResult.Sweep).length
    const losses = results.filter((r) => r === SeriesResult.Loss || r === SeriesResult.Swept).length
    const ties = results.filter((r) => r === SeriesResult.Tie).length

    // Calculate winning percentage
    const total = wins + losses + ties
    const pct = total > 0 ? (wins + 0.5 * ties) / total : NaN

    const last10 = results.slice(-10).map(seriesResultToChar)
    const streak = calculateStreak(results)

    return { wins, losses, ties, pct, last10, streak }
  }, [team, seasonSeries])

  return {
    ...stats,
    isPending,
    isError,
    refetch,
  }
}
