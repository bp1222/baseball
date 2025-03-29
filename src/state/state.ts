import {Season, Team} from "@bp1222/stats-api"

import {Series} from "@/types/Series"

export type AppState = {
  /* Static Global State */
  seasons?: Season[]

  /* Updatable State */
  teams?: Team[]
  seasonSeries?: Series[]
}

