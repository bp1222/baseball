/**
 * Seasons Query
 *
 * Fetches and caches the list of all MLB seasons.
 * Seasons are static data that never changes.
 */

import { queryOptions, useQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"

import { Route } from "@/routes/__root"
import { api } from "@/services/MlbAPI"

/**
 * Stale time: Infinity (static)
 * Historical seasons never change.
 */
const SEASONS_STALE_TIME = Infinity

/**
 * Minimum season year to include (data quality issues before this)
 */
const MIN_SEASON_YEAR = 1921

export const seasonsOptions = queryOptions({
  queryKey: ["seasons"],
  staleTime: SEASONS_STALE_TIME,
  queryFn: async () => {
    const { seasons } = await api.getAllSeasons({ sportId: 1 })
    return seasons
      .filter((s) => parseInt(s.seasonId) > MIN_SEASON_YEAR)
      .reverse()
  },
})

/**
 * Get all seasons
 */
export const useSeasons = () => useQuery(seasonsOptions)

/**
 * Get the current season based on route params or default
 * Uses select to derive from the seasons list (no extra fetch)
 */
export const useSeason = () => {
  const { defaultSeason } = Route.useRouteContext()
  const params = useParams({ strict: false })
  const seasonId = params.seasonId ?? defaultSeason

  return useQuery({
    ...seasonsOptions,
    select: (seasons) => seasons.find((s) => s.seasonId === seasonId)!,
  })
}