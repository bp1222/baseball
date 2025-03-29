import {Season, Team} from "@bp1222/stats-api"
import {Dispatch} from "react"

import {Series} from "@/types/Series"

export enum AppStateAction {
  Seasons = "seasons",
  Teams = "teams",
  SeasonSeries = "series"
}

export type AppStateActions =
  | { type: AppStateAction.Seasons; seasons: Season[] }
  | { type: AppStateAction.Teams; teams: Team[] }
  | { type: AppStateAction.SeasonSeries; series: Series[] }

export type AppStateDispatch = Dispatch<AppStateActions>
