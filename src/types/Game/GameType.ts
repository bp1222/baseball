import { GameType as MLBGameType } from '@bp1222/stats-api'

export enum GameType {
  Exhibition,
  SpringTraining,
  Regular,
  WildCardSeries,
  DivisionSeries,
  LeagueChampionshipSeries,
  WorldSeries,
}

export const GameTypeFromMLBGameType = (gameType: MLBGameType): GameType => {
  switch (gameType) {
    case MLBGameType.Exhibition:
      return GameType.Exhibition
    case MLBGameType.SpringTraining:
      return GameType.SpringTraining
    case MLBGameType.Regular:
      return GameType.Regular
    case MLBGameType.WildCardSeries:
      return GameType.WildCardSeries
    case MLBGameType.DivisionSeries:
      return GameType.DivisionSeries
    case MLBGameType.LeagueChampionshipSeries:
      return GameType.LeagueChampionshipSeries
    case MLBGameType.WorldSeries:
      return GameType.WorldSeries
  }
}
