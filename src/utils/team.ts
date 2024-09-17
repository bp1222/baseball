import {MLBTeam} from "@bp1222/stats-api";

export const FindTeam = (teams: MLBTeam[], teamId: string|undefined): MLBTeam | undefined => {
  return teams.find((t) => t.id == parseInt(teamId ?? ""));
}