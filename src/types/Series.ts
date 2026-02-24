import dayjs from 'dayjs'

import { Game } from './Game'
import { SeriesType } from './Series/SeriesType'

/** Grapefruit League = Florida, Cactus League = Arizona */
export type SpringLeague = 'grapefruit' | 'cactus'

export type Series = {
  pk: string
  type: SeriesType
  games: Game[]
  startDate?: dayjs.Dayjs
  endDate?: dayjs.Dayjs

  /** Set for SpringTraining series: which league (venue location). */
  springLeague?: SpringLeague
}
