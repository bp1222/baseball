import { Season as MLBSeason } from '@bp1222/stats-api'

export type Season = {
  seasonId: string
  seasonStartDate: string
  seasonEndDate: string
  preSeasonStartDate?: string
  preSeasonEndDate?: string
  regularSeasonStartDate: string
  regularSeasonEndDate: string
  postSeasonStartDate?: string
  postSeasonEndDate?: string
}

export const SeasonFromMLBSeason = (season: MLBSeason): Season => ({
  seasonId: season.seasonId,
  seasonStartDate: season.seasonStartDate,
  seasonEndDate: season.seasonEndDate,
  preSeasonStartDate: season.preSeasonStartDate,
  preSeasonEndDate: season.preSeasonEndDate,
  regularSeasonStartDate: season.regularSeasonStartDate,
  regularSeasonEndDate: season.regularSeasonEndDate,
  postSeasonStartDate: season.postSeasonStartDate,
  postSeasonEndDate: season.postSeasonEndDate,
})
