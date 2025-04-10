import {Game, GameType, GetTeamsRequest, MlbApi, Season} from "@bp1222/stats-api";
import memoize from "@/utils/memoize.ts";

const api = new MlbApi().withPreMiddleware(async (ctx) => {
  ctx.init.cache = "no-cache"
  return ctx
})

export const getSeasons = () => {
  return api.getAllSeasons({sportId: 1})
}

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
    startDate: season.seasonStartDate,
    endDate: season.postSeasonEndDate ?? season.seasonEndDate,
    fields: ["date", "gamePk", "dates", "games", "gameType", "gameDate",
      "officialDate", "status", "codedGameState", "teams", "away", "home",
      "score", "team", "name", "id", "isWinner", "seriesNumber",
      "gamesInSeries", "seriesGameNumber", "division", "seriesNumber", "league", "link",
      "clubName", "leagueRecord", "wins", "losses"],
    hydrate: "team(league)"
  })
}

export const getGameLinescore= memoize((gamePk: Game['gamePk']) => {
  return api.getLinescore({gamePk: gamePk})
})

export const getGameBoxscore = memoize((gamePk: Game['gamePk']) => {
  return api.getBoxscore({gamePk: gamePk})
})