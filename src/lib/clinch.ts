/** MLB standings clinchIndicator letter meanings. */
const CLINCH_LABELS: Record<string, string> = {
  w: 'wild card',
  x: 'playoff berth',
  y: 'division',
  z: 'best record',
}

export function clinchSeriesLabel(
  abbreviation: string,
  clinchIndicator?: string,
): string {
  const key = clinchIndicator?.trim().toLowerCase()
  if (!key) return abbreviation
  // Non-breaking spaces keep "LAD − z" from wrapping mid-label.
  return `${abbreviation}\u00A0−\u00A0${key}`
}

export function clinchFootnote(
  indicators: Array<string | undefined>,
): string | undefined {
  const present = new Set(
    indicators.map((i) => i?.trim().toLowerCase()).filter((i): i is string => Boolean(i)),
  )
  if (present.size === 0) return undefined

  const parts = [...present]
    .sort()
    .map((key) => `${key} ${CLINCH_LABELS[key] ?? 'clinched'}`)

  return `Clinched: ${parts.join(' · ')}`
}
