import {Game} from "@bp1222/stats-api"

import {SeriesType} from "./Series/SeriesType"

export interface Series {
  pk: string
  type: SeriesType
  startDate: string
  endDate: string
  games: Game[]
}

