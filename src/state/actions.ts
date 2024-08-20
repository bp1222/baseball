import { Dispatch } from "react";
import { MLBSeason, MLBTeam } from "../services/MlbApi";

export enum AppStateAction {
  Teams = "teams",
  Seasons = "seasons",
}

export type AppStateActions =
  | { type: AppStateAction.Teams; teams: MLBTeam[] }
  | { type: AppStateAction.Seasons; seasons: MLBSeason[] };

export type AppStateDispatch = Dispatch<AppStateActions>;
