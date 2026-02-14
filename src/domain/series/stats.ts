/**
 * Series statistics — pure business logic (no React, no I/O)
 *
 * Used by useSeriesStats and any future consumers of series aggregates.
 */

import { SeriesResult } from "@/types/Series/SeriesResult"

/**
 * Calculate the current streak from series results (e.g. "W3", "L2", "T1")
 */
export function calculateStreak(results: SeriesResult[]): string {
  if (results.length === 0) return ""

  const last = results[results.length - 1]
  const isWin = last === SeriesResult.Win || last === SeriesResult.Sweep
  const isLoss = last === SeriesResult.Loss || last === SeriesResult.Swept
  const isTie = last === SeriesResult.Tie

  if (!isWin && !isLoss && !isTie) return ""

  let count = 0
  for (let i = results.length - 1; i >= 0; i--) {
    const r = results[i]
    if (isWin && (r === SeriesResult.Win || r === SeriesResult.Sweep)) {
      count++
    } else if (isLoss && (r === SeriesResult.Loss || r === SeriesResult.Swept)) {
      count++
    } else if (isTie && r === SeriesResult.Tie) {
      count++
    } else {
      break
    }
  }

  if (count === 0) return ""
  return isWin ? `W${count}` : isLoss ? `L${count}` : `T${count}`
}

/**
 * Map a series result to a single character for display (e.g. last 10)
 */
export function seriesResultToChar(result: SeriesResult): string {
  if (result === SeriesResult.Win || result === SeriesResult.Sweep) return "W"
  if (result === SeriesResult.Loss || result === SeriesResult.Swept) return "L"
  if (result === SeriesResult.Tie) return "T"
  return "-"
}
