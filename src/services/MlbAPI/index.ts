/**
 * MLB API Service Layer
 *
 * This module provides raw fetch functions for MLB data.
 * All caching is handled by TanStack Query - do NOT add memoization here.
 *
 * Naming convention: fetchX for data fetchers
 */

import { GameType, MlbApi, Season } from "@bp1222/stats-api"

import { SeriesFromMLBSchedule } from "@/domain/series/generator"

/**
 * Configured MLB API client
 * - Disables browser cache to let TanStack Query manage freshness
 */
export const api = new MlbApi().withPreMiddleware(async (ctx) => {
  ctx.init.cache = "no-cache"
  return ctx
})

/**
 * Fields requested for schedule/game endpoints
 */
const baseGameFields = [
  "dates", "date", "name", "games", "gamePk", "status", "codedGameState", "gameType",
  "gameDate", "rescheduledFromData", "rescheduledToDate",
  "gamesInSeries", "seriesGameNumber",
  "teams", "away", "home", "isWinner", "seriesNumber", "score",
  "leagueRecord", "wins", "losses", "pct",
  "team", "id",
  "venue"
]

/**
 * Fetch full season schedule and transform into Series objects
 * Cached by TanStack Query with key: ["schedule", seasonId]
 */
export const fetchSeasonSchedule = async (season: Season) => {
  const data = await api.getSchedule({
    sportId: 1,
    gameTypes: [
      GameType.Regular,
      GameType.WildCardSeries,
      GameType.DivisionSeries,
      GameType.LeagueChampionshipSeries,
      GameType.WorldSeries,
    ],
    startDate: season.seasonStartDate,
    endDate: season.postSeasonEndDate ?? season.seasonEndDate,
    fields: baseGameFields,
  })
  return SeriesFromMLBSchedule(data.dates.flatMap((d) => d.games))
}

// Legacy alias for backward compatibility during migration
export const getSeasonSchedule = fetchSeasonSchedule
