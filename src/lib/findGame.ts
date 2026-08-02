import type { Game } from '@bp1222/stats-api'
import type { Series } from './series'

/** Find a game by pk in a season schedule series list. */
export function findGameInSeriesList(
  seriesList: Series[] | undefined,
  gamePk: number,
): Game | undefined {
  if (!seriesList || !(gamePk > 0)) return undefined
  for (const series of seriesList) {
    const hit = series.games.find((g) => g.gamePk === gamePk)
    if (hit) return hit
  }
  return undefined
}
