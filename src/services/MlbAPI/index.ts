import {GameType, MlbApi, Season} from "@bp1222/stats-api";
import memoize from "@/utils/memoize.ts";
import {Game, GameFromMLBGame} from "@/types/Game.ts";
import {GameStatus} from "@/types/Game/GameStatus.ts";
import {TeamFromMLBTeam} from "@/types/Team.ts";
import {LinescoreFromMLBLinescore} from "@/types/Linescore.ts";
import {SeriesFromMLBSchedule} from "@/utils/GenerateSeasonSeries.ts";
import dayjs from "dayjs";
import {BoxscoreFromMLBBoxscore} from "@/types/Boxscore.ts";
import {StandingsFromMLBDivisionStandingsList} from "@/types/Standings.ts";
import {DivisionFromMLBDivision} from "@/types/Division.ts";
import {LeagueFromMLBLeague} from "@/types/League.ts";

const api = new MlbApi().withPreMiddleware(async (ctx) => {
  ctx.init.cache = "no-cache"
  return ctx
})

export const getSeasons = memoize(() => {
  return api.getAllSeasons({sportId: 1})
}, () => "allSeasons")

export const getLeagues = memoize(async (season: Season) => {
  const data = await api.getLeagues({sportId: 1, season: season.seasonId})
  return data.leagues.map((l) => LeagueFromMLBLeague(l))
}, (season) => {
  return `${season.seasonId}`
})

export const getDivisions = memoize(async (season: Season) => {
  const data = await api.getDivisions({sportId: 1, season: season.seasonId})
  return data.divisions.map((d) => DivisionFromMLBDivision(d))
}, (season) => {
  return `${season.seasonId}`
})

export const getTeams= memoize(async (season: Season) => {
  const data = await api.getTeams({
    sportId: 1,
    leagueIds: [103, 104],
    season: season.seasonId,
    fields: [
      "teams", "id", "name", "teamName", "shortName", "abbreviation", "franchiseName",
      "league", "division", "nameShort"
    ],
    hydrate: "division"
  })

  return data.teams.sort((a, b) => a.name.localeCompare(b.name) ?? 0).map((t) => TeamFromMLBTeam(t))
}, (season) => {
  return `${season.seasonId}`
})

const baseGameFields = [
  "dates", "games", "gamePk", "status", "codedGameState", "gameType",
  "gameDate", "rescheduledFromData", "rescheduledToDate",
  "gamesInSeries", "seriesGameNumber",
  "teams", "away", "home", "isWinner", "seriesNumber", "score",
  "leagueRecord", "wins", "losses", "pct",
  "team", "id",
  "venue"
]

export const getSeasonSchedule = memoize(async (season: Season) => {
  const data = await api.getSchedule({
    sportId: 1,
    leagueIds: [103, 104],
    gameTypes: [GameType.Regular, GameType.WildCardSeries, GameType.DivisionSeries, GameType.LeagueChampionshipSeries, GameType.WorldSeries],
    startDate: season.seasonStartDate,
    endDate: season.postSeasonEndDate ?? season.seasonEndDate,
    fields: baseGameFields,
  })

  return SeriesFromMLBSchedule(data.dates.flatMap((d) => d.games))
}, (season) => {
  return `${season.seasonId}`
})

export const getGame = memoize(async (game: Game) => {
  const g = await api.getSchedule({
    gamePk: game.pk,
    sportId: 1,
    leagueIds: [103, 104],
    gameTypes: [GameType.Regular, GameType.WildCardSeries, GameType.DivisionSeries, GameType.LeagueChampionshipSeries, GameType.WorldSeries],
    fields: baseGameFields,
  })
  return GameFromMLBGame(g.dates[0].games[0])
}, (game) => {
  if (game.gameStatus == GameStatus.InProgress) {
    return false
  }
  if (dayjs(game.gameDate).isToday()) {
    return false
  }
  return `${game.pk}`
})

export const getGameLinescore= memoize(async (game: Game) => {
  const data = await api.getLinescore({gamePk: game.pk})
  return LinescoreFromMLBLinescore(data)
}, (game) => {
  if (game.gameStatus == GameStatus.InProgress) {
    return false
  }
  return `${game.pk}`
})

export const getGameBoxscore = memoize(async (game: Game) => {
  const data = await api.getBoxscore({gamePk: game.pk})
  return BoxscoreFromMLBBoxscore(data)
}, (game) => {
  if (game.gameStatus == GameStatus.InProgress) {
    return false
  }
  return `${game.pk}`
})

export const getStandings = memoize(async (season: string, league: number) => {
  const standings = await api.getStandings({
    leagueId: league,
    season: season,
    fields: [
      "records", "standingsType", "league", "division", "id", "teamRecords",
      "team", "divisionRank", "leagueRank", "leagueGamesBack", "wildCardGamesBack",
      "leagueGamesBack", "divisionGamesBack", "gamesBack", "eliminationNumber", "wildCardEliminationNumber",
      "wins", "losses", "winningPercentage", "clinched", "wildCardClinched",
    ],
  })
  return StandingsFromMLBDivisionStandingsList(standings)
}, (season, league) => {
  return `${season}-${league}`
})
