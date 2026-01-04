import {queryOptions, useQuery} from "@tanstack/react-query"

import {api} from "@/services/MlbAPI"
import {BoxscoreFromMLBBoxscore} from "@/types/Boxscore.ts"

export const gameBoxscoreOptions = (gamePk: number) => queryOptions({
  queryKey: ['gameBoxscore', gamePk],
  staleTime: 1000 * 10, // 10 seconds
  queryFn: () => api.getBoxscore({gamePk: gamePk}).then((data) => BoxscoreFromMLBBoxscore(data))
})

export const useBoxscore = (gamePk: number) => {
  return useQuery(gameBoxscoreOptions(gamePk))
}