import { Dispatch } from "react";
import {MLBSchedule, MLBSeason, MLBTeam} from "@bp1222/stats-api";

export enum AppStateAction {
  Teams = "teams",
  Seasons = "seasons",
  SeasonSchedule = "seasonSchedule",
}

export type AppStateActions =
  | { type: AppStateAction.Teams; teams: MLBTeam[] }
  | { type: AppStateAction.Seasons; seasons: MLBSeason[] }
  | { type: AppStateAction.SeasonSchedule; schedule: MLBSchedule };

export type AppStateDispatch = Dispatch<AppStateActions>;
