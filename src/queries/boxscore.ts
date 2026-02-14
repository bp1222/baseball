/**
 * Boxscore Query
 *
 * Fetches and caches detailed game boxscore (player stats).
 * Used in the game detail modal.
 */

import { queryOptions, useQuery } from "@tanstack/react-query"

import { api } from "@/services/MlbAPI"
import { BoxscoreFromMLBBoxscore } from "@/types/Boxscore"

/**
 * Stale times based on game status:
 * - Live games: 30 seconds (stats update as plays happen)
 * - Final games: 1 hour (data won't change)
 */
const BOXSCORE_STALE_TIME_LIVE = 1000 * 30
const BOXSCORE_STALE_TIME_FINAL = 1000 * 60 * 60

export const boxscoreOptions = (gamePk: number, isLive: boolean = false) =>
  queryOptions({
    queryKey: ["boxscore", gamePk],
    staleTime: isLive ? BOXSCORE_STALE_TIME_LIVE : BOXSCORE_STALE_TIME_FINAL,
    // Auto-refresh live games every 30 seconds
    refetchInterval: isLive ? BOXSCORE_STALE_TIME_LIVE : false,
    queryFn: async () => {
      const data = await api.getBoxscore({ gamePk })
      return BoxscoreFromMLBBoxscore(data)
    },
  })

/**
 * Get boxscore for a game
 * @param gamePk - Game primary key
 * @param isLive - Whether the game is currently in progress (enables auto-refresh)
 */
export const useBoxscore = (gamePk: number, isLive: boolean = false) => {
  return useQuery(boxscoreOptions(gamePk, isLive))
}