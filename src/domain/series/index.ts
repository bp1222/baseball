/**
 * Series domain — pure business logic for series aggregation and stats
 */

export { SeriesFromMLBSchedule } from './factory'
export { GetSeriesHomeAway, GetSeriesLosses, GetSeriesResult, GetSeriesWins } from './result'
export { calculateStreak, seriesResultToChar } from './stats'
