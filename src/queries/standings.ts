/**
 * Standings Query
 *
 * Fetches and caches league standings for a season.
 * Standings update throughout the season as games complete.
 */

import { queryOptions, useQuery } from "@tanstack/react-query"

import { api } from "@/services/MlbAPI"
import { StandingsFromMLBDivisionStandingsList } from "@/types/Standings"

/**
 * Stale time: 1 hour
 * Standings change after each game, but hourly refresh is sufficient
 * for non-live viewing. Users can manually refresh if needed.
 */
const STANDINGS_STALE_TIME = 1000 * 60 * 60

export const standingsOptions = (seasonId?: string, leagueId?: number) =>
  queryOptions({
    queryKey: ["standings", seasonId, leagueId],
    staleTime: STANDINGS_STALE_TIME,
    enabled: !!seasonId && !!leagueId,
    queryFn: async () => {
      const standings = await api.getStandings({
        season: seasonId!,
        leagueId: leagueId!,
        fields: [
          "records", "standingsType", "league", "division", "id", "teamRecords",
          "team", "divisionRank", "leagueRank", "leagueGamesBack", "wildCardGamesBack",
          "leagueGamesBack", "divisionGamesBack", "gamesBack", "eliminationNumber",
          "wildCardEliminationNumber", "wins", "losses", "winningPercentage",
          "clinched", "wildCardClinched",
        ],
      })
      return StandingsFromMLBDivisionStandingsList(standings)
    },
  })

/**
 * Get standings for a specific season and league
 */
export const useStandings = (seasonId?: string, leagueId?: number) => {
  return useQuery(standingsOptions(seasonId, leagueId))
}