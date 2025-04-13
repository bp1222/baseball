import {Season, Team} from "@bp1222/stats-api"
import {Dispatch} from "react"

import {Series} from "@/types/Series"
import dayjs from "@/utils/dayjs.ts"

export enum AppStateAction {
  Seasons = "seasons",
  Teams = "teams",
  SeasonSeries = "series",
  SelectedDate = "selectedDate"
}

export type AppStateActions =
  | { type: AppStateAction.Seasons; seasons: Season[] }
  | { type: AppStateAction.Teams; teams: Team[] }
  | { type: AppStateAction.SeasonSeries; series: Series[] }
  | { type: AppStateAction.SelectedDate; selectedDate?: dayjs.Dayjs }

export type AppStateDispatch = Dispatch<AppStateActions>
