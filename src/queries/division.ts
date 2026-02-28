/**
 * Divisions Query
 *
 * Fetches and caches MLB divisions for a season.
 * Divisions are static within a season.
 */

import { queryOptions, useQuery, UseQueryResult } from '@tanstack/react-query'

import { useSeason } from '@/queries/season'
import { referenceApi } from '@/services/MlbAPI'
import { Division, DivisionFromMLBDivision } from '@/types/Division'

/**
 * Stale time: Infinity (static)
 * Division structure doesn't change within a season.
 */
const DIVISIONS_STALE_TIME = Infinity

export const divisionsOptions = (seasonId?: string) =>
  queryOptions({
    queryKey: ['divisions', seasonId],
    staleTime: DIVISIONS_STALE_TIME,
    enabled: !!seasonId,
    queryFn: async () => {
      const data = await referenceApi.getDivisions({ sportId: 1, season: seasonId! })
      return data.divisions.map((d) => DivisionFromMLBDivision(d))
    },
  })

type GetDivisionFunc = (divisionId: number | undefined) => Division | undefined

/**
 * Get divisions for the current season with a helper to find by ID
 */
export const useDivisions = (): {
  getDivision: GetDivisionFunc
  data: UseQueryResult<Division[]>
} => {
  const { data: season } = useSeason()
  const divisions = useQuery(divisionsOptions(season?.seasonId))

  return {
    getDivision: (divisionId: number | undefined) => divisions.data?.find((d) => d.id === divisionId),
    data: divisions,
  }
}
