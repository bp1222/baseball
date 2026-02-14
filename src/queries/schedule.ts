/**
 * Schedule Query
 *
 * Fetches and caches the full season schedule (all series).
 * This is the primary data source for both day view and team view.
 */

import type { Season } from "@bp1222/stats-api"
import { queryOptions, useQuery } from "@tanstack/react-query"

import { useSeason } from "@/queries/season"
import { fetchSeasonSchedule } from "@/services/MlbAPI"

/**
 * Stale time: 1 hour
 * Schedule data changes infrequently (game scores update, but structure doesn't).
 * For live score updates, components fetch linescore separately.
 */
const SCHEDULE_STALE_TIME = 1000 * 60 * 60

export const scheduleOptions = (season?: Season) =>
  queryOptions({
    queryKey: ["schedule", season?.seasonId],
    staleTime: SCHEDULE_STALE_TIME,
    enabled: !!season?.seasonId,
    queryFn: () => fetchSeasonSchedule(season!),
  })

export const useSchedule = () => {
  const { data: season } = useSeason()
  return useQuery(scheduleOptions(season))
}