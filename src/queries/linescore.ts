/**
 * Linescore Query
 *
 * Fetches and caches game linescore (inning-by-inning scores).
 * Used for live game status and final game summaries.
 */

import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/services/MlbAPI'
import { LinescoreFromMLBLinescore } from '@/types/Linescore'

/**
 * Stale times based on game status:
 * - Live games: 30 seconds (frequent updates needed)
 * - Final games: 1 hour (data won't change)
 *
 * Default to shorter time; callers can override for final games.
 */
const LINESCORE_STALE_TIME_LIVE = 1000 * 30
const LINESCORE_STALE_TIME_FINAL = Infinity

export const linescoreOptions = (gamePk: number, isLive: boolean = false) =>
  queryOptions({
    queryKey: ['linescore', gamePk],
    staleTime: isLive ? LINESCORE_STALE_TIME_LIVE : LINESCORE_STALE_TIME_FINAL,
    // Auto-refresh live games every 30 seconds
    refetchInterval: isLive ? LINESCORE_STALE_TIME_LIVE : false,
    queryFn: async () => {
      const data = await api.getLinescore({ gamePk })
      return LinescoreFromMLBLinescore(data)
    },
  })

/**
 * Get linescore for a game
 * @param gamePk - Game primary key
 * @param isLive - Whether the game is currently in progress (enables auto-refresh)
 */
export const useLinescore = (gamePk: number, isLive: boolean = false) => {
  return useQuery(linescoreOptions(gamePk, isLive))
}
