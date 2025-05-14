import {Team as MLBTeam} from "@bp1222/stats-api"

export type Team = {
  id: number
  name: string
  franchiseName?: string
  teamName?: string
  abbreviation?: string
  league: number
  division?: number
}

export const TeamFromMLBTeam = (team: MLBTeam): Team => {
  return ({
    id: team.id,
    name: team.name,
    franchiseName: team.franchiseName,
    teamName: team.teamName,
    abbreviation: team.abbreviation,
    league: team.league!.id,
    division: team.division?.id,
  })
}