import {Season} from "@bp1222/stats-api"

import {Boxscore} from "@/types/Boxscore.ts"
import {Division} from "@/types/Division.ts"
import {League} from "@/types/League.ts"
import {Linescore} from "@/types/Linescore.ts"
import {Series} from "@/types/Series.ts"
import {Team} from "@/types/Team.ts"

export type AppState = {
  seasons: Season[]
  leagues: League[]
  divisions: Division[]
  teams: Team[]
  seasonSeries: Series[]
}

export enum AppStateAction {
  Seasons = "seasons",
  League = "league",
  Divisions = "divisions",
  Teams = "teams",
  SeasonSeries = "series",
  Linescore = "linescore",
  Boxscore = "boxscore",
}

export type AppStateActions =
  | { type: AppStateAction.Seasons; seasons: Season[] }
  | { type: AppStateAction.League; leagues: League[] }
  | { type: AppStateAction.Divisions; divisions: Division[] }
  | { type: AppStateAction.Teams; teams: Team[] }
  | { type: AppStateAction.SeasonSeries; series: Series[] }
  | { type: AppStateAction.Linescore; gameId: number, linescore: Linescore }
  | { type: AppStateAction.Boxscore; gameId: number, boxscore: Boxscore }

export type AppStateApi = {
  setSeasons: (seasons: Season[]) => void
  setLeagues: (teams: League[]) => void
  setDivisions: (teams: Division[]) => void
  setTeams: (teams: Team[]) => void
  setSeasonSeries: (series: Series[]) => void
  setLinescore: (gameId: number, linescore: Linescore) => void
  setBoxscore: (gameId: number, boxscore: Boxscore) => void
}

export type AppStateUtil = {
  getSeason: (seasonId: string | number | undefined) => Season | undefined
  getLeague: (leagueId: string | number | undefined) => League | undefined
  getDivision: (divisionId: string | number | undefined) => Division | undefined
  getTeam: (teamId: string | number | undefined) => Team | undefined
}
