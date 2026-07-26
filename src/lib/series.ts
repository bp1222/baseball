import type { Game, Team } from '@bp1222/stats-api'

export type SeriesStatus =
  | 'in_progress_today'
  | 'in_progress_offday'
  | 'completed'
  | 'upcoming'

export type SeriesRecord = {
  wins: number
  losses: number
  ties: number
}

export type TeamSeriesRecord = {
  wins: number
  losses: number
  ties: number
}

export type Series = {
  id: string
  homeTeam: Team
  awayTeam: Team
  games: Game[]
  gamesInSeries: number
  seriesNumber: number
  homeWins: number
  awayWins: number
  status: SeriesStatus
}

function teamId(game: Game, side: 'home' | 'away'): number {
  return game.teams[side].team.id
}

function opponentPairKey(game: Game): string {
  const a = teamId(game, 'home')
  const b = teamId(game, 'away')
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

function seriesKey(game: Game): string {
  const seriesNumber =
    game.teams.home.seriesNumber ??
    game.teams.away.seriesNumber ??
    game.seriesGameNumber ??
    0
  return `${game.season}-${opponentPairKey(game)}-${seriesNumber}`
}

function isFinal(game: Game): boolean {
  return (
    game.status.abstractGameState === 'Final' ||
    game.status.codedGameState === 'F' ||
    game.status.codedGameState === 'O'
  )
}

function isLive(game: Game): boolean {
  return (
    game.status.abstractGameState === 'Live' ||
    game.status.codedGameState === 'I'
  )
}

function isScheduled(game: Game): boolean {
  return (
    game.status.abstractGameState === 'Preview' ||
    game.status.codedGameState === 'S' ||
    game.status.codedGameState === 'P'
  )
}

function gameDateKey(game: Game): string {
  return game.officialDate || game.gameDate.slice(0, 10)
}

function todayKey(now = new Date()): string {
  // Use local calendar date for "today" series filtering.
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function compareGames(a: Game, b: Game): number {
  const aNum = a.seriesGameNumber ?? 0
  const bNum = b.seriesGameNumber ?? 0
  if (aNum !== bNum) return aNum - bNum
  return gameDateKey(a).localeCompare(gameDateKey(b)) || a.gamePk - b.gamePk
}

function countWins(games: Game[]): { homeWins: number; awayWins: number } {
  let homeWins = 0
  let awayWins = 0
  for (const game of games) {
    if (!isFinal(game)) continue
    if (game.isTie) continue
    if (game.teams.home.isWinner) homeWins += 1
    else if (game.teams.away.isWinner) awayWins += 1
  }
  return { homeWins, awayWins }
}

export function deriveSeriesStatus(
  games: Game[],
  now = new Date(),
): SeriesStatus {
  const today = todayKey(now)
  const anyFinal = games.some(isFinal)
  const anyLive = games.some(isLive)
  const allFinal = games.length > 0 && games.every(isFinal)
  const hasTodayGame = games.some((g) => gameDateKey(g) === today)

  if (allFinal) return 'completed'
  if (!anyFinal && !anyLive) return 'upcoming'
  if (hasTodayGame || anyLive) return 'in_progress_today'
  return 'in_progress_offday'
}

function isPostponed(game: Game): boolean {
  const detail = (game.status.detailedState ?? '').toLowerCase()
  return (
    detail.includes('postponed') ||
    game.status.codedGameState === 'D' ||
    Boolean(game.status.statusCode?.startsWith('D'))
  )
}

/** Prefer the played/makeup record when MLB lists the same gamePk twice (postponed + final). */
function preferGameRecord(a: Game, b: Game): Game {
  const aPost = isPostponed(a)
  const bPost = isPostponed(b)
  if (aPost !== bPost) return aPost ? b : a

  const rank = (g: Game) => {
    if (isLive(g)) return 3
    if (g.status.codedGameState === 'F' || g.status.codedGameState === 'O') return 2
    if (isScheduled(g)) return 1
    return 0
  }
  return rank(b) >= rank(a) ? b : a
}

function dedupeGamesByPk(games: Game[]): Game[] {
  const byPk = new Map<number, Game>()
  for (const game of games) {
    const existing = byPk.get(game.gamePk)
    byPk.set(game.gamePk, existing ? preferGameRecord(existing, game) : game)
  }
  return [...byPk.values()]
}

export function groupGamesIntoSeries(
  games: Game[],
  now = new Date(),
): Series[] {
  const byKey = new Map<string, Game[]>()

  for (const game of dedupeGamesByPk(games)) {
    const key = seriesKey(game)
    const list = byKey.get(key)
    if (list) list.push(game)
    else byKey.set(key, [game])
  }

  const series: Series[] = []

  for (const [id, rawGames] of byKey) {
    const ordered = [...rawGames].sort(compareGames)
    const first = ordered[0]
    if (!first) continue

    const { homeWins, awayWins } = countWins(ordered)
    const seriesNumber =
      first.teams.home.seriesNumber ??
      first.teams.away.seriesNumber ??
      first.seriesGameNumber ??
      1

    series.push({
      id,
      homeTeam: first.teams.home.team,
      awayTeam: first.teams.away.team,
      games: ordered,
      gamesInSeries: first.gamesInSeries ?? ordered.length,
      seriesNumber,
      homeWins,
      awayWins,
      status: deriveSeriesStatus(ordered, now),
    })
  }

  return series.sort((a, b) => {
    const aDate = gameDateKey(a.games[0]!)
    const bDate = gameDateKey(b.games[0]!)
    return aDate.localeCompare(bDate) || a.id.localeCompare(b.id)
  })
}

export function activeUnfinishedSeries(
  series: Series[],
): { today: Series[]; offday: Series[] } {
  const today: Series[] = []
  const offday: Series[] = []
  for (const s of series) {
    if (s.status === 'in_progress_today') today.push(s)
    else if (s.status === 'in_progress_offday') offday.push(s)
  }
  return { today, offday }
}

export type SeriesOutcome =
  | 'win'
  | 'loss'
  | 'sweep'
  | 'swept'
  | 'split'
  | 'in_progress'
  | 'upcoming'

export function seriesDateRange(series: Series): { start: string; end: string } {
  const dates = series.games.map(gameDateKey).sort()
  return { start: dates[0] ?? '', end: dates[dates.length - 1] ?? '' }
}

export function seriesSpansDate(series: Series, date: string): boolean {
  const { start, end } = seriesDateRange(series)
  return Boolean(start && end && date >= start && date <= end)
}

export function seriesHasGameOnDate(series: Series, date: string): boolean {
  return series.games.some((g) => gameDateKey(g) === date)
}

/**
 * Max calendar-day span between consecutive games that still counts as a
 * mid-series off day (e.g. Mon/Tue then Thu). Larger gaps are treated as
 * postponed/makeup windows and excluded from the landing off-day list.
 */
const MAX_INTRASERIES_GAP_DAYS = 4

function calendarDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T12:00:00`).getTime()
  const end = new Date(`${endDate}T12:00:00`).getTime()
  return Math.round((end - start) / (24 * 60 * 60 * 1000))
}

/**
 * True when focusDate is an off day inside an already-started, unfinished
 * series — a short gap between consecutive games, not a long wait until a
 * makeup/reschedule.
 */
export function seriesIsActiveOffday(series: Series, focusDate: string): boolean {
  if (seriesHasGameOnDate(series, focusDate)) return false

  const anyStarted = series.games.some((g) => isFinal(g) || isLive(g))
  if (!anyStarted) return false
  if (series.games.length > 0 && series.games.every(isFinal)) return false

  const dates = [...new Set(series.games.map(gameDateKey))].sort()
  for (let i = 0; i < dates.length - 1; i++) {
    const prev = dates[i]!
    const next = dates[i + 1]!
    if (focusDate <= prev || focusDate >= next) continue
    if (calendarDaysBetween(prev, next) <= MAX_INTRASERIES_GAP_DAYS) {
      return true
    }
  }
  return false
}

/** Series that span a focus date, split by whether they play that day. */
export function seriesForFocusDate(
  series: Series[],
  focusDate: string,
): { playing: Series[]; offday: Series[] } {
  const playing: Series[] = []
  const offday: Series[] = []
  for (const s of series) {
    if (seriesHasGameOnDate(s, focusDate)) {
      playing.push(s)
      continue
    }
    if (seriesIsActiveOffday(s, focusDate)) {
      offday.push(s)
    }
  }
  return { playing, offday }
}

export function gameDatesFromSeries(series: Series[]): string[] {
  const set = new Set<string>()
  for (const s of series) {
    for (const g of s.games) set.add(gameDateKey(g))
  }
  return [...set].sort()
}

export function seriesOutcomeForTeam(
  series: Series,
  teamId?: number,
): SeriesOutcome {
  const allFinal = series.games.length > 0 && series.games.every(isFinal)
  const anyStarted =
    series.games.some(isFinal) || series.games.some(isLive)

  if (!anyStarted) return 'upcoming'
  if (!allFinal) return 'in_progress'

  if (teamId == null) {
    if (series.homeWins === series.awayWins) return 'split'
    return 'in_progress'
  }

  const isHome = series.homeTeam.id === teamId
  const teamWins = isHome ? series.homeWins : series.awayWins
  const oppWins = isHome ? series.awayWins : series.homeWins
  const decided = series.games.filter((g) => isFinal(g) && !g.isTie).length

  if (teamWins === oppWins) return 'split'
  if (teamWins > oppWins && oppWins === 0 && decided >= 2) return 'sweep'
  if (oppWins > teamWins && teamWins === 0 && decided >= 2) return 'swept'
  if (teamWins > oppWins) return 'win'
  return 'loss'
}

export function seriesOutcomeLabel(outcome: SeriesOutcome): string {
  switch (outcome) {
    case 'win':
      return 'Win'
    case 'loss':
      return 'Loss'
    case 'sweep':
      return 'Sweep'
    case 'swept':
      return 'Swept'
    case 'split':
      return 'Split'
    case 'in_progress':
      return 'In progress'
    case 'upcoming':
      return 'Upcoming'
  }
}

export function seriesOutcomeColors(outcome: SeriesOutcome): {
  light: string
  main: string
} {
  switch (outcome) {
    case 'win':
      return { light: '#e8f5e9', main: '#66bb6a' }
    case 'loss':
      return { light: '#ffebee', main: '#ef5350' }
    case 'sweep':
      return { light: '#fff8e1', main: '#ffca28' }
    case 'swept':
      return { light: '#efebe9', main: '#a1887f' }
    case 'split':
      return { light: '#e3f2fd', main: '#42a5f5' }
    case 'in_progress':
      return { light: '#eceff1', main: '#90a4ae' }
    case 'upcoming':
      return { light: '#f5f5f5', main: '#bdbdbd' }
  }
}

export function formatMonthDay(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatMonthDayUpper(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`)
  return d
    .toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    .toUpperCase()
}

export function gameStatusFooter(game: Game): string {
  if (isLive(game)) {
    return game.status.detailedState ?? 'Live'
  }
  if (isFinal(game)) {
    const detail = game.status.detailedState ?? 'Final'
    if (detail.startsWith('Final')) return detail === 'Final' ? 'F' : detail.replace('Final', 'F')
    return detail.length > 6 ? 'F' : detail
  }
  if (game.status.startTimeTBD) return 'TBD'
  try {
    return new Date(game.gameDate).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return game.status.detailedState ?? 'Sched'
  }
}

/** Series W–L–T from the perspective of `teamId`. */
export function seriesRecordForTeam(
  seriesList: Series[],
  teamId: number,
): TeamSeriesRecord {
  return seriesStatsForTeam(seriesList, teamId)
}

export type SeriesStats = TeamSeriesRecord & {
  pct: number
  /** Chronological last ≤10 completed results as W/L/T */
  last10: Array<'W' | 'L' | 'T'>
  /** e.g. W3, L2, T1 */
  streak: string
}

function completedOutcomeChar(
  series: Series,
  teamId: number,
): 'W' | 'L' | 'T' | null {
  if (series.status !== 'completed') return null
  const isHome = series.homeTeam.id === teamId
  const isAway = series.awayTeam.id === teamId
  if (!isHome && !isAway) return null
  const teamWins = isHome ? series.homeWins : series.awayWins
  const oppWins = isHome ? series.awayWins : series.homeWins
  if (teamWins > oppWins) return 'W'
  if (teamWins < oppWins) return 'L'
  return 'T'
}

export function seriesStatsForTeam(
  seriesList: Series[],
  teamId: number,
): SeriesStats {
  let wins = 0
  let losses = 0
  let ties = 0
  const results: Array<'W' | 'L' | 'T'> = []

  for (const s of seriesList) {
    const ch = completedOutcomeChar(s, teamId)
    if (ch == null) continue
    results.push(ch)
    if (ch === 'W') wins += 1
    else if (ch === 'L') losses += 1
    else ties += 1
  }

  const decided = wins + losses
  const pct = decided === 0 ? Number.NaN : wins / decided
  const last10 = results.slice(-10)
  const streak = streakFromResults(results)

  return { wins, losses, ties, pct, last10, streak }
}

function streakFromResults(results: Array<'W' | 'L' | 'T'>): string {
  if (results.length === 0) return ''
  const last = results[results.length - 1]!
  let count = 0
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i] !== last) break
    count += 1
  }
  return `${last}${count}`
}

export function formatSeriesPct(pct: number): string {
  if (Number.isNaN(pct)) return '—'
  if (pct === 1) return '1.000'
  return pct.toFixed(3).substring(1)
}

export function formatSeriesScore(series: Series, fromTeamId?: number): string {
  if (fromTeamId == null) {
    return `${series.awayWins}–${series.homeWins}`
  }
  const isHome = series.homeTeam.id === fromTeamId
  const teamWins = isHome ? series.homeWins : series.awayWins
  const oppWins = isHome ? series.awayWins : series.homeWins
  return `${teamWins}–${oppWins}`
}

export function opponentOf(series: Series, teamId: number): Team {
  return series.homeTeam.id === teamId ? series.awayTeam : series.homeTeam
}

export function isGameFinal(game: Game): boolean {
  return isFinal(game)
}

export function isGameLive(game: Game): boolean {
  return isLive(game)
}

export function isGameScheduled(game: Game): boolean {
  return isScheduled(game)
}

export function formatGameDate(game: Game): string {
  return gameDateKey(game)
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`)
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function localToday(): string {
  return todayKey()
}
