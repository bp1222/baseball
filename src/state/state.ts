import { MLBSeason, MLBTeam } from "../services/MlbApi";

export type AppState = {
  teams: MLBTeam[];
  seasons: MLBSeason[];

};
