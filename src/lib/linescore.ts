import type { Linescore } from '@bp1222/stats-api'

export type BaseOccupancy = {
  first: boolean
  second: boolean
  third: boolean
}

export function linescoreBases(linescore: Linescore | undefined): BaseOccupancy {
  const offense = linescore?.offense ?? {}
  return {
    first: Boolean(offense.first),
    second: Boolean(offense.second),
    third: Boolean(offense.third),
  }
}

/** Compact inning label, e.g. "▲8", "▼3", "Mid5", "End7". */
export function formatLinescoreInning(linescore: Linescore): string {
  const inning = linescore.currentInning ?? linescore.currentInningOrdinal ?? ''
  const state = (linescore.inningState ?? linescore.inningHalf ?? '').toLowerCase()

  if (state === 'top') return `▲${inning}`
  if (state === 'bottom' || state === 'bot') return `▼${inning}`
  if (state === 'middle' || state === 'mid') return `Mid${inning}`
  if (state === 'end') return `End${inning}`
  if (inning !== '') return String(inning)
  return 'Live'
}

export function linescoreHasStarted(linescore: Linescore | undefined): boolean {
  return linescore?.currentInning != null
}

export function formatOutsLabel(outs: number | undefined): string {
  if (outs == null) return ''
  if (outs === 1) return '1 out'
  return `${outs} outs`
}

/**
 * Inning cell for a linescore half.
 * Final games use "X" for halves that were never played (e.g. bottom of the 9th).
 * Live games leave not-yet-played halves blank.
 */
export function formatInningRuns(
  runs: number | null | undefined,
  gameFinal: boolean,
): string {
  if (runs != null) return String(runs)
  return gameFinal ? 'X' : ''
}
