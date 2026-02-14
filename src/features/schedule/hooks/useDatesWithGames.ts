/**
 * Hook to compute dates that have games from the schedule
 *
 * Returns:
 * - sortedDates: Array of dayjs dates with games, sorted chronologically
 * - datesSet: Set of date strings (YYYY-MM-DD) for quick lookup (e.g., calendar highlighting)
 */

import dayjs from "dayjs"
import { useMemo } from "react"

import { useSchedule } from "@/queries/schedule"

type UseDatesWithGamesResult = {
  /** Sorted array of dates that have games */
  sortedDates: dayjs.Dayjs[]
  /** Set of date strings (YYYY-MM-DD) for quick lookup */
  datesSet: Set<string>
  /** Whether the schedule data is loading */
  isPending: boolean
}

export const useDatesWithGames = (): UseDatesWithGamesResult => {
  const { data: seasonSeries, isPending } = useSchedule()

  const sortedDates = useMemo(() => {
    if (!seasonSeries?.length) return []
    const set = new Set<string>()
    seasonSeries.forEach((s) =>
      s.games.forEach((g) => set.add(dayjs(g.gameDate).format("YYYY-MM-DD")))
    )
    return Array.from(set)
      .sort()
      .map((d) => dayjs(d).startOf("day"))
  }, [seasonSeries])

  const datesSet = useMemo(
    () => new Set(sortedDates.map((d) => d.format("YYYY-MM-DD"))),
    [sortedDates]
  )

  return { sortedDates, datesSet, isPending }
}
