import {queryOptions, useQuery} from "@tanstack/react-query"

import {api} from "@/services/MlbAPI"
import {LinescoreFromMLBLinescore} from "@/types/Linescore.ts"

export const gameLinescoreOptions = (gamePk: number) => queryOptions({
  queryKey: ['gameLinescore', gamePk],
  staleTime: 1000 * 60, // 1 minute
  queryFn: () => api.getLinescore({gamePk: gamePk}).then((data) => LinescoreFromMLBLinescore(data))
})

export const useLinescore = (gamePk: number) => {
  return useQuery(gameLinescoreOptions(gamePk))
}