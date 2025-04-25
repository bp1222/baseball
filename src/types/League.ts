import {League as MLBLeague} from "@bp1222/stats-api"

export type League = {
  id: number
  name: string
  abbreviation?: string
}

export const LeagueFromMLBLeague = (league: MLBLeague): League => ({
  id: league.id,
  name: league.name,
  abbreviation: league.abbreviation,
})

