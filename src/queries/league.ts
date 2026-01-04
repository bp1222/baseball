import {queryOptions, useQuery, UseQueryResult} from "@tanstack/react-query"
import {useParams} from "@tanstack/react-router"
import dayjs from "dayjs"

import {api} from "@/services/MlbAPI"
import {League, LeagueFromMLBLeague} from "@/types/League.ts"

export const leagueOptions = (seasonId: string) => queryOptions({
  queryKey: ['league', seasonId],
  staleTime: "static",
  queryFn: async () => {
    const data = await api.getLeagues({sportId: 1, season: seasonId})
    return data.leagues.map((d) => LeagueFromMLBLeague(d))
  },
})

type GetLeagueFunc = (leagueId: number) => League | undefined

export const useLeagues= (): {getLeague: GetLeagueFunc, data: UseQueryResult<League[]>} => {
  const params = useParams({strict: false})
  const seasonId = params.seasonId ?? dayjs().format('YYYY')

  const leagues = useQuery(leagueOptions(seasonId))

  return {
    getLeague: (divisonId: number) => leagues.data?.find((d) => d.id === divisonId),
    data: leagues,
  }
}