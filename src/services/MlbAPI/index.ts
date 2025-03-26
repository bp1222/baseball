import {Game, GameType, GetTeamsRequest, MlbApi, Season} from "@bp1222/stats-api";

const api = new MlbApi()

export const getTeamsForSeason = (seasonId: GetTeamsRequest['season']) => {
  return api.getTeams({
    sportId: 1,
    leagueIds: [103, 104],
    season: seasonId,
  })
}

export const getSeasonSchedule = (season: Season) => {
  return api.getSchedule({
    sportId: 1,
    gameTypes: [GameType.Regular, GameType.WildCardSeries, GameType.DivisionSeries, GameType.LeagueChampionshipSeries, GameType.WorldSeries],
    startDate: season.regularSeasonStartDate,
    endDate: season.postSeasonEndDate ?? season.seasonEndDate,
    fields: ["date", "gamePk", "dates", "games", "gameType", "gameDate",
      "officialDate", "status", "codedGameState", "teams", "away", "home",
      "score", "team", "name", "id", "isWinner", "seriesNumber",
      "gamesInSeries", "seriesGameNumber", "division", "seriesNumber", "league", "link"],
    hydrate: "team(league)"
  })
}

export const getLinescoreForGame = (gamePk: Game['gamePk']) => {
  return api.getLinescore({gamePk: gamePk})
}
