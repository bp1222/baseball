import { MLBSeason, MLBTeam } from "../services/MlbApi";

export type AppState = {
  team: MLBTeam;
  teams: MLBTeam[];

  season: MLBSeason;
  seasons: MLBSeason[];
};
