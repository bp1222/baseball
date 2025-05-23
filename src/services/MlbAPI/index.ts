import {GameType, MlbApi, Schedule, ScheduleDay, Season} from "@bp1222/stats-api";
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
  "dates", "date", "name", "games", "gamePk", "status", "codedGameState", "gameType",
  "gameDate", "rescheduledFromData", "rescheduledToDate",
  "gamesInSeries", "seriesGameNumber",
  "teams", "away", "home", "isWinner", "seriesNumber", "score",
  "leagueRecord", "wins", "losses", "pct",
  "team", "id",
  "venue"
]

export const getSeasonSchedule = memoize(async (season: Season) => {
  /*
  const games = [630886, 630890, 630897, 630898, 630888]

  const data: Schedule = {
    dates: [] as Array<ScheduleDay>
  } as Schedule

  for (const pk of games) {
    const fetched = await api.getSchedule({
      sportId: 1,
      leagueIds: [103, 104],
      gameTypes: [GameType.Regular, GameType.WildCardSeries, GameType.DivisionSeries, GameType.LeagueChampionshipSeries, GameType.WorldSeries],
      startDate: season.seasonStartDate,
      endDate: season.postSeasonEndDate ?? season.seasonEndDate,
      fields: baseGameFields,
      gamePk: pk,
    })
    data.dates = [...data.dates, ...fetched.dates]
  }
  */

  const dates = [["2020-09-21", "2020-09-27"]]
  const data: Schedule = {dates: [] as Array<ScheduleDay>} as Schedule
  for (const date of dates) {
    const rec = await api.getSchedule({
      sportId: 1,
      leagueIds: [103, 104],
      gameTypes: [GameType.Regular, GameType.WildCardSeries, GameType.DivisionSeries, GameType.LeagueChampionshipSeries, GameType.WorldSeries],
      startDate: season.seasonStartDate,
      endDate: season.postSeasonEndDate ?? season.seasonEndDate,
      fields: baseGameFields,
    })

    /**
     * Bad Data Patching
    // Series number for a Phillies @ Nationals game on 2020-09-22 incorrectly
    // depicts the series number to be 9, not 17, which is a series with Miami
    rec.dates.map((d => d.games.map((g) => {
      if ([630896, 630892, 630884].includes(g.gamePk)) {
        g.teams.home.seriesNumber = 17
      }
    })))
     */

    data.dates = [...data.dates, ...rec.dates]
  }

  data.dates.filter((d => d.games.filter((g) => g.teams.home.team.id == 120 || g.teams.home.team.id == 120)))

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
