import {queryOptions, useQuery, UseQueryResult} from "@tanstack/react-query"
import {useParams} from "@tanstack/react-router"
import dayjs from "dayjs"

import {api} from "@/services/MlbAPI"
import {Division, DivisionFromMLBDivision} from "@/types/Division.ts"

export const divisionOptions = (seasonId: string) => queryOptions({
  queryKey: ['division', seasonId],
  staleTime: "static",
  queryFn: async () => {
    const data = await api.getDivisions({sportId: 1, season: seasonId})
    return data.divisions.map((d) => DivisionFromMLBDivision(d))
  },
})

type GetDivisionFunc = (divisionId: number | undefined) => Division | undefined

export const useDivisions= (): {getDivision: GetDivisionFunc, data: UseQueryResult<Division[]>} => {
  const params = useParams({strict: false})
  const seasonId = params.seasonId ?? dayjs().format('YYYY')

  const divisions = useQuery(divisionOptions(seasonId))

  return {
    getDivision: (divisionId: number | undefined) => divisions.data?.find((d) => d.id === divisionId),
    data: divisions,
  }
}