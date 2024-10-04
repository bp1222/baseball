import {Season, Team} from "@bp1222/stats-api"
import { Dispatch } from "react"

import {Series} from "../models/Series.ts"

export enum AppStateAction {
  Teams = "teams",
  Seasons = "seasons",
  SeasonSeries = "series"
}

export type AppStateActions =
  | { type: AppStateAction.Teams; teams: Team[] }
  | { type: AppStateAction.Seasons; seasons: Season[] }
  | { type: AppStateAction.SeasonSeries; series: Series[] }

export type AppStateDispatch = Dispatch<AppStateActions>
