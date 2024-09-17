import {MLBSchedule, MLBSeason, MLBTeam} from "@bp1222/stats-api";

export type AppState = {
  teams: MLBTeam[] | null;
  seasons: MLBSeason[] | null;

  seasonSchedule: MLBSchedule | null;
};
