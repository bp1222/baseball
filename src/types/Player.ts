import { Player as MLBPlayer } from '@bp1222/stats-api'

export type Player = {
  id: number
  name: string
  jerseyNumber: string
  battingOrder: string
  position?: string
  stats: {
    batting: {
      hits?: number
      atBats?: number
      runs?: number
      rbi?: number
      baseOnBalls?: number
      strikeOuts?: number
      avg?: string
      ops?: string
    }
    pitching: {
      strikes?: number
      balls?: number
      hits?: number
      homeRuns?: number
      battersFaced?: number
      era?: string
      runs?: number
      earnedRuns?: number
      inningsPitched?: string
      strikeouts?: number
      walks?: number
    }
  }
}

export const PlayerFromMLBPlayer = (player: MLBPlayer): Player => ({
  id: player.person.id,
  name: player.person.fullName,
  jerseyNumber: player.jerseyNumber ?? 'X',
  battingOrder: player.battingOrder ?? '0',
  position: player.position.abbreviation,
  stats: {
    batting: {
      hits: player.stats.batting.hits,
      atBats: player.stats.batting.atBats,
      runs: player.stats.batting.runs,
      rbi: player.stats.batting.rbi,
      baseOnBalls: player.stats.batting.baseOnBalls,
      strikeOuts: player.stats.batting.strikeOuts,
      avg: player.seasonStats.batting.avg,
      ops: player.seasonStats.batting.ops,
    },
    pitching: {
      strikes: player.stats.pitching.strikes,
      balls: player.stats.pitching.balls,
      hits: player.stats.pitching.hits,
      homeRuns: player.stats.pitching.homeRuns,
      battersFaced: player.stats.pitching.battersFaced,
      era: player.seasonStats.pitching.era,
      runs: player.stats.pitching.runs,
      earnedRuns: player.stats.pitching.earnedRuns,
      inningsPitched: player.stats.pitching.inningsPitched,
      strikeouts: player.stats.pitching.strikeOuts,
      walks: player.stats.pitching.baseOnBalls,
    },
  },
})
