/**
 * Leagues Query
 *
 * Fetches and caches MLB leagues (AL/NL) for a season.
 * Leagues are static within a season.
 */

import { queryOptions, useQuery, UseQueryResult } from "@tanstack/react-query"

import { useSeason } from "@/queries/season"
import { api } from "@/services/MlbAPI"
import { League, LeagueFromMLBLeague } from "@/types/League"

/**
 * Stale time: Infinity (static)
 * League structure doesn't change within a season.
 */
const LEAGUES_STALE_TIME = Infinity

export const leaguesOptions = (seasonId?: string) =>
  queryOptions({
    queryKey: ["leagues", seasonId],
    staleTime: LEAGUES_STALE_TIME,
    enabled: !!seasonId,
    queryFn: async () => {
      const data = await api.getLeagues({ sportId: 1, season: seasonId! })
      return data.leagues.map((l) => LeagueFromMLBLeague(l))
    },
  })

type GetLeagueFunc = (leagueId: number) => League | undefined

/**
 * Get leagues for the current season with a helper to find by ID
 */
export const useLeagues = (): {
  getLeague: GetLeagueFunc
  data: UseQueryResult<League[]>
} => {
  const { data: season } = useSeason()
  const leagues = useQuery(leaguesOptions(season?.seasonId))

  return {
    getLeague: (leagueId: number) =>
      leagues.data?.find((l) => l.id === leagueId),
    data: leagues,
  }
}