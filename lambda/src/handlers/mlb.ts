import { MlbApi, MLBSeason, MLBStandingsList } from "@bp1222/stats-api"

const mlbApi = new MlbApi()

export const GetStandings = async (seasonId: string, leagueId: string, date: string): Promise<MLBStandingsList> => {
  return await mlbApi.getStandings({
    leagueId: parseInt(leagueId),
    season: seasonId,
    date: date,
    fields: [
      "records", "division", "id", "team", "name", "teamRecords", "leagueRecord", "wins", "losses", "ties", "pct", "divisionGamesBack", "gamesPlayed", "magicNumber"
    ]
  })
}

export const GetSeason = async (season: string): Promise<MLBSeason> => {
  const seasons = await mlbApi.getSeason({sportId: 1, season: season})
  if (seasons.seasons.length > 0) {
    return seasons.seasons[0]
  } else {
    return null
  }
}