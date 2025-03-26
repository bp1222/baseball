import {Team} from "@bp1222/stats-api"

export const GetTeam = (teams: Team[] | undefined, teamId: Team['id']): Team | undefined => {
  return teams?.find((t) => t.id == teamId)
}