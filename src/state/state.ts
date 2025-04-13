import {Season, Team} from "@bp1222/stats-api"

import {Series} from "@/types/Series"
import dayjs from "@/utils/dayjs.ts"

export type AppState = {
  /* Static Global State */
  seasons?: Season[]

  /* Updatable State */
  selectedDate?: dayjs.Dayjs
  teams?: Team[]
  seasonSeries?: Series[]
}

