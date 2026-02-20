import { GameTeam as MLBGameTeam } from '@bp1222/stats-api'

export type GameTeam = {
  teamId: number
  score: number
  isHome: boolean
  isWinner: boolean
  record: {
    wins?: number
    losses?: number
    ties?: number
    pct?: string
  }
  runs?: number
  hits?: number
  errors?: number
  leftOnBase?: number
}

export const GameTeamFromMLBGameTeam = (gameTeam: MLBGameTeam, isHome: boolean = false): GameTeam => ({
  teamId: gameTeam.team.id,
  score: gameTeam.score,
  isHome: isHome,
  isWinner: gameTeam.isWinner,
  record: {
    wins: gameTeam.leagueRecord?.wins,
    losses: gameTeam.leagueRecord?.losses,
    ties: gameTeam.leagueRecord?.ties,
    pct: gameTeam.leagueRecord?.pct,
  },
})
