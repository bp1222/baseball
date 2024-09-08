import { MLBSeason, MLBTeam } from "@bp1222/stats-api";

export type AppState = {
  teams: MLBTeam[];
  seasons: MLBSeason[];
};
