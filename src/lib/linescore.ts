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
