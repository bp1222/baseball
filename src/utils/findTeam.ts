import memoize from "fast-memoize";
import {MLBTeam} from "@bp1222/stats-api";

export const FindTeam = memoize((teams: MLBTeam[]|null, teamId: number | undefined): MLBTeam | undefined => {
  return teams?.find((t) => t.id == teamId);
});

