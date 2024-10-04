import {Season, Team} from "@bp1222/stats-api"

import {Series} from "../models/Series.ts"

export type AppState = {
  teams?: Team[]
  seasons?: Season[]

  seasonSeries?: Series[]
}
