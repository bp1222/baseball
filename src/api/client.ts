import {
  Configuration,
  GameType,
  GamesApi,
  PeopleApi,
  ReferenceApi,
  ScheduleApi,
  StandingsApi,
} from '@bp1222/stats-api'

const configuration = new Configuration({
  basePath: 'https://statsapi.mlb.com/api',
})

export const scheduleApi = new ScheduleApi(configuration)
export const referenceApi = new ReferenceApi(configuration)
export const standingsApi = new StandingsApi(configuration)
export const gamesApi = new GamesApi(configuration)
export const peopleApi = new PeopleApi(configuration)

export const MLB_SPORT_ID = 1

/** Regular + postseason + All-Star (excludes exhibition & spring). */
export const COMPETITIVE_GAME_TYPES: GameType[] = [
  GameType.Regular,
  GameType.WildCardSeries,
  GameType.DivisionSeries,
  GameType.LeagueChampionshipSeries,
  GameType.WorldSeries,
  GameType.AllStar,
]
