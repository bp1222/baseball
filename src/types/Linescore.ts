import { Inning as MLBInning, Linescore as MLBLinescore, LinescoreTeam as MLBLinescoreTeam } from '@bp1222/stats-api'

export type LinescoreTeam = {
  runs: number
  hits: number
  errors: number
  leftOnBase: number
}

const LinescoreTeamFromMLBLinescoreTeam = (linescore: MLBLinescoreTeam): LinescoreTeam => ({
  runs: linescore.runs,
  hits: linescore.hits,
  errors: linescore.errors,
  leftOnBase: linescore.leftOnBase,
})

export type Inning = {
  num: number
  away: LinescoreTeam
  home: LinescoreTeam
}

const InningFromMLBInning = (inning: MLBInning): Inning => ({
  num: inning.num,
  away: LinescoreTeamFromMLBLinescoreTeam(inning.away),
  home: LinescoreTeamFromMLBLinescoreTeam(inning.home),
})

export type Linescore = {
  currentInning?: number
  currentInningOrdinal?: string
  scheduledInnings?: number
  isTopInning?: boolean
  balls?: number
  strikes?: number
  outs?: number
  /** Runner on first (for live baserunner diamond); not in MLB linescore response yet */
  runnerOnFirst?: boolean
  runnerOnSecond?: boolean
  runnerOnThird?: boolean
  innings: Array<Inning>
  away: LinescoreTeam
  home: LinescoreTeam
}

export const LinescoreFromMLBLinescore = (linescore: MLBLinescore): Linescore => ({
  currentInning: linescore.currentInning,
  currentInningOrdinal: linescore.currentInningOrdinal,
  scheduledInnings: linescore.scheduledInnings,
  isTopInning: linescore.isTopInning,
  balls: linescore.balls,
  strikes: linescore.strikes,
  outs: linescore.outs,
  innings: linescore.innings?.map((inning) => InningFromMLBInning(inning)) ?? [],
  away: LinescoreTeamFromMLBLinescoreTeam(linescore.teams.away),
  home: LinescoreTeamFromMLBLinescoreTeam(linescore.teams.home),
})
