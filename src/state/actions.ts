import { Dispatch } from "react";
import { MLBSeason, MLBTeam } from "../services/MlbApi";

export enum AppStateAction {
  Team = "team",
  Teams = "teams",
  Season = "season",
  Seasons = "seasons",
}

export type AppStateActions =
  | { type: AppStateAction.Team; team: MLBTeam }
  | { type: AppStateAction.Teams; teams: MLBTeam[] }
  | { type: AppStateAction.Season; season: MLBSeason }
  | { type: AppStateAction.Seasons; seasons: MLBSeason[] };

export type AppStateDispatch = Dispatch<AppStateActions>;
