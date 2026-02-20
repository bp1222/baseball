import { DivisionStandingsList as MLBDivisionStandingsList } from '@bp1222/stats-api'

export type DivisionRecord = {
  teamId: number
  division?: number
  divisionRank?: string
  leagueRank: string
  divisionChamp?: boolean
  leagueGamesBack?: string
  wildCardGamesBack?: string
  divisionGamesBack?: string
  gamesBack: string
  eliminationNumber?: string
  wildCardEliminationNumber?: string
  wins: number
  losses: number
  winningPercentage?: string
  clinched?: boolean
  gamesPlayed?: number
}

export type Standings = {
  league: number
  division: number
  records: DivisionRecord[]
}

export const StandingsFromMLBDivisionStandingsList = (standings: MLBDivisionStandingsList): Standings[] => {
  return standings.records.map((standing): Standings => {
    return {
      league: standing.league.id,
      division: standing.division?.id,
      records: standing.teamRecords.map(
        (record): DivisionRecord => ({
          teamId: record.team.id,
          division: standing.division?.id,
          divisionRank: record.divisionRank,
          leagueRank: record.leagueRank,
          divisionChamp: record.divisionChamp,
          leagueGamesBack: record.leagueGamesBack,
          wildCardGamesBack: record.wildCardGamesBack,
          divisionGamesBack: record.divisionGamesBack,
          gamesBack: record.gamesBack,
          eliminationNumber: record.eliminationNumber,
          wildCardEliminationNumber: record.wildCardEliminationNumber,
          wins: record.wins,
          losses: record.losses,
          winningPercentage: record.winningPercentage,
          clinched: record.clinched,
          gamesPlayed: record.gamesPlayed,
        }),
      ),
    }
  })
}
