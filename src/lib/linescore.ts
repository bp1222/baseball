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

/**
 * Whether the linescore has a current inning populated.
 * MLB often sets currentInning=1 / Top during Pre-Game — call sites must also
 * require Live/Final (or equivalent) game status before treating play as begun.
 */
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

export type LinescoreInningColumn = {
  num: number
  away?: { runs?: number | null }
  home?: { runs?: number | null }
}

/**
 * Columns for the linescore grid: at least `scheduledInnings` (7 for some
 * doubleheaders, otherwise usually 9), plus any extra innings already played.
 * Future games often have an empty innings array — still show the full grid.
 */
export function padLinescoreInnings(
  linescore: Linescore | undefined,
  scheduledInnings?: number | null,
): LinescoreInningColumn[] {
  const byNum = new Map<number, LinescoreInningColumn>()
  for (const inn of linescore?.innings ?? []) {
    if (inn.num != null) byNum.set(inn.num, inn)
  }
  const scheduled = linescore?.scheduledInnings ?? scheduledInnings ?? 9
  const maxPlayed = byNum.size > 0 ? Math.max(...byNum.keys()) : 0
  const count = Math.max(scheduled, maxPlayed, 1)
  const cols: LinescoreInningColumn[] = []
  for (let num = 1; num <= count; num++) {
    cols.push(byNum.get(num) ?? { num })
  }
  return cols
}
