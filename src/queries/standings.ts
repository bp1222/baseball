import {queryOptions, useQuery} from "@tanstack/react-query"

import {api} from "@/services/MlbAPI"
import {StandingsFromMLBDivisionStandingsList} from "@/types/Standings.ts"

export const standingsOptions = (seasonId?: string, leagueId?: number) => queryOptions({
  queryKey: ['standings', seasonId, leagueId],
  staleTime: 1000 * 60 * 60, // 1 hour
  enabled: !!seasonId && !!leagueId,
  queryFn: () => api.getStandings({
      season: seasonId!,
      leagueId: leagueId!,
      fields: [
        "records", "standingsType", "league", "division", "id", "teamRecords",
        "team", "divisionRank", "leagueRank", "leagueGamesBack", "wildCardGamesBack",
        "leagueGamesBack", "divisionGamesBack", "gamesBack", "eliminationNumber", "wildCardEliminationNumber",
        "wins", "losses", "winningPercentage", "clinched", "wildCardClinched",
      ],
    }).then(
      (standings) => StandingsFromMLBDivisionStandingsList(standings)
  )
})

export const useStandings= (seasonId?: string, leagueId?: number) => {
  return useQuery(standingsOptions(seasonId, leagueId))
}