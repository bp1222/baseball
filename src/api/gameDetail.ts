import { useQuery } from '@tanstack/react-query'
import type { Boxscore, Game, GameLiveFeed, Linescore } from '@bp1222/stats-api'
import { gamesApi } from './client'
import { isGameLive } from '../lib/series'

export type GameDetailData = {
  boxscore: Boxscore
  linescore?: Linescore
  feed?: GameLiveFeed
}

export function useGameDetail(game: Game, enabled: boolean) {
  const gamePk = game.gamePk
  const live = isGameLive(game)

  return useQuery({
    queryKey: ['gameDetail', gamePk] as const,
    queryFn: async (): Promise<GameDetailData> => {
      const [boxscore, linescore, feed] = await Promise.all([
        gamesApi.getBoxscore({ gamePk }),
        gamesApi.getLinescore({ gamePk }).catch(() => undefined),
        gamesApi.getGameLiveFeed({ gamePk }).catch(() => undefined),
      ])
      return {
        boxscore,
        linescore: linescore ?? feed?.liveData?.linescore,
        feed,
      }
    },
    enabled: enabled && gamePk > 0,
    staleTime: 20_000,
    refetchInterval: live ? 60_000 : false,
  })
}
