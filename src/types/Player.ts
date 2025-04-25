import {Player as MLBPlayer} from "@bp1222/stats-api"

export type Player = {
  id: string
  name: string
  jerseyNumber: string
  battingOrder: number
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
  }
}

export function PlayerFromMLBPlayer(player: MLBPlayer): Player {
  return {
    id: player.person.id,
    name: player.person.fullName,
    jerseyNumber: player.jerseyNumber ?? "X",
    battingOrder: player.battingOrder ?? 0,
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
      }
    }
  }
}