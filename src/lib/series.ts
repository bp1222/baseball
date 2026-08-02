import type { Game, Team } from '@bp1222/stats-api'
import { AL_LEAGUE_ID, NL_LEAGUE_ID } from './mlb'

export type SeriesStatus =
  'in_progress_today' | 'in_progress_offday' | 'completed' | 'upcoming'

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
  /** MLB game type for the series (R/F/D/L/W/A). */
  gameType?: Game['gameType']
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

function isPostponed(game: Game): boolean {
  const detail = (game.status.detailedState ?? '').toLowerCase()
  return (
    detail.includes('postponed') ||
    game.status.codedGameState === 'D' ||
    Boolean(game.status.statusCode?.startsWith('D'))
  )
}

function isFinal(game: Game): boolean {
  // MLB sometimes leaves abstractGameState=Final on delayed/postponed shells.
  if (isPostponed(game)) return false
  return (
    game.status.abstractGameState === 'Final' ||
    game.status.codedGameState === 'F' ||
    game.status.codedGameState === 'O'
  )
}

function isLive(game: Game): boolean {
  return game.status.abstractGameState === 'Live' || game.status.codedGameState === 'I'
}

/** In-progress delay/suspension (rain, weather, etc.) — still abstractGameState=Live. */
function isDelayed(game: Game): boolean {
  const detail = (game.status.detailedState ?? '').toLowerCase()
  if (detail.includes('delay') || detail.includes('suspended')) return true
  const code = game.status.statusCode ?? ''
  // Multi-char I* codes (IR rain delay, etc.) are delayed in-progress states.
  return code.startsWith('I') && code.length > 1
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

/** Wins for the series' fixed home/away clubs (not per-game venue). */
function countWins(
  games: Game[],
  seriesHomeId: number,
  seriesAwayId: number,
): { homeWins: number; awayWins: number } {
  let homeWins = 0
  let awayWins = 0
  for (const game of games) {
    if (!isFinal(game) || game.isTie) continue
    const winnerId = game.teams.home.isWinner
      ? game.teams.home.team.id
      : game.teams.away.isWinner
        ? game.teams.away.team.id
        : null
    if (winnerId === seriesHomeId) homeWins += 1
    else if (winnerId === seriesAwayId) awayWins += 1
  }
  return { homeWins, awayWins }
}

export function deriveSeriesStatus(games: Game[], now = new Date()): SeriesStatus {
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

export function groupGamesIntoSeries(games: Game[], now = new Date()): Series[] {
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

    const homeTeam = first.teams.home.team
    const awayTeam = first.teams.away.team
    const { homeWins, awayWins } = countWins(ordered, homeTeam.id, awayTeam.id)
    const seriesNumber =
      first.teams.home.seriesNumber ??
      first.teams.away.seriesNumber ??
      first.seriesGameNumber ??
      1

    series.push({
      id,
      homeTeam,
      awayTeam,
      games: ordered,
      gamesInSeries: first.gamesInSeries ?? ordered.length,
      seriesNumber,
      gameType: first.gameType,
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

export function activeUnfinishedSeries(series: Series[]): {
  today: Series[]
  offday: Series[]
} {
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
  | 'world_champions'
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
  playing.sort((a, b) => compareSeriesByGameStart(a, b, focusDate))
  offday.sort((a, b) => compareSeriesByNextGameStart(a, b, focusDate))
  return { playing, offday }
}

/** Earliest start time among games on the focus date (ISO `gameDate`). */
function earliestStartOnDate(series: Series, focusDate: string): number {
  let earliest = Number.POSITIVE_INFINITY
  for (const game of series.games) {
    if (gameDateKey(game) !== focusDate) continue
    const t = Date.parse(game.gameDate)
    if (!Number.isNaN(t) && t < earliest) earliest = t
  }
  return earliest
}

/** Next scheduled game on or after focusDate (for off-day ordering). */
function nextStartOnOrAfter(series: Series, focusDate: string): number {
  let earliest = Number.POSITIVE_INFINITY
  for (const game of series.games) {
    if (gameDateKey(game) < focusDate) continue
    const t = Date.parse(game.gameDate)
    if (!Number.isNaN(t) && t < earliest) earliest = t
  }
  return earliest
}

function compareSeriesByGameStart(a: Series, b: Series, focusDate: string): number {
  const byTime = earliestStartOnDate(a, focusDate) - earliestStartOnDate(b, focusDate)
  if (byTime !== 0) return byTime
  return a.id.localeCompare(b.id)
}

function compareSeriesByNextGameStart(a: Series, b: Series, focusDate: string): number {
  const byTime = nextStartOnOrAfter(a, focusDate) - nextStartOnOrAfter(b, focusDate)
  if (byTime !== 0) return byTime
  return a.id.localeCompare(b.id)
}

export function gameDatesFromSeries(series: Series[]): string[] {
  const set = new Set<string>()
  for (const s of series) {
    for (const g of s.games) set.add(gameDateKey(g))
  }
  return [...set].sort()
}

/**
 * Default day for season browsing: last day a game was played (on or before today).
 * If the season has not started yet, the first scheduled game day.
 */
export function defaultSeasonFocusDate(
  gameDates: string[],
  today: string = localToday(),
): string | undefined {
  let lastPlayed: string | undefined
  for (const d of gameDates) {
    if (d <= today) lastPlayed = d
    else break
  }
  return lastPlayed ?? gameDates[0]
}

export function seriesOutcomeForTeam(series: Series, teamId?: number): SeriesOutcome {
  const allFinal = series.games.length > 0 && series.games.every(isFinal)
  const anyStarted = series.games.some(isFinal) || series.games.some(isLive)

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
  if (teamWins > oppWins) {
    if (series.gameType === 'W') return 'world_champions'
    if (oppWins === 0 && decided >= 2) return 'sweep'
    return 'win'
  }
  if (oppWins > teamWins && teamWins === 0 && decided >= 2) return 'swept'
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
    case 'world_champions':
      return 'World Champions'
    case 'in_progress':
      return 'In progress'
    case 'upcoming':
      return 'Upcoming'
  }
}

function leaguePrefix(team: Team): 'AL' | 'NL' | null {
  const id = team.league?.id
  if (id === AL_LEAGUE_ID) return 'AL'
  if (id === NL_LEAGUE_ID) return 'NL'
  return null
}

export function isPostseasonSeries(series: Series): boolean {
  const t = series.gameType
  return t === 'F' || t === 'D' || t === 'L' || t === 'W' || t === 'A'
}

/**
 * Short round label for postseason / All-Star series (null for regular season).
 * Prefers the perspective team's league for AL/NL prefixes when available.
 */
export function postseasonRoundLabel(
  series: Series,
  perspectiveTeamId?: number,
): string | null {
  const t = series.gameType
  if (!t || t === 'R') return null

  const perspective =
    perspectiveTeamId != null
      ? series.homeTeam.id === perspectiveTeamId
        ? series.homeTeam
        : series.awayTeam.id === perspectiveTeamId
          ? series.awayTeam
          : series.homeTeam
      : series.homeTeam
  const lg = leaguePrefix(perspective) ?? leaguePrefix(series.awayTeam)

  switch (t) {
    case 'F':
      return lg ? `${lg} Wild Card` : 'Wild Card'
    case 'D':
      return lg ? `${lg}DS` : 'Division Series'
    case 'L':
      return lg ? `${lg}CS` : 'LCS'
    case 'W':
      return 'World Series'
    case 'A':
      return 'All-Star'
    default:
      return null
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
    case 'world_champions':
      return { light: '#f7efd2', main: '#9a7b0a' }
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
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()
}

export function formatGameStartTime(game: Game): string | null {
  if (game.status.startTimeTBD) return 'TBD'
  try {
    return new Date(game.gameDate).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return null
  }
}

export function gameStatusFooter(game: Game): string {
  const delay = gameDelayLabel(game)
  if (delay) return delay
  if (isLive(game)) {
    return game.status.detailedState ?? 'Live'
  }
  if (isFinal(game)) {
    const detail = game.status.detailedState ?? 'Final'
    if (detail.startsWith('Final'))
      return detail === 'Final' ? 'F' : detail.replace('Final', 'F')
    return detail.length > 6 ? 'F' : detail
  }
  return formatGameStartTime(game) ?? game.status.detailedState ?? 'Sched'
}

/** Full delay copy for tooltips / modal (e.g. "Delayed Rain"). */
export function gameDelayLabel(game: Game): string | null {
  if (!isDelayed(game)) return null
  const reason = gameStatusReason(game)
  if (reason) return `Delayed ${reason}`
  const detailed = game.status.detailedState?.trim()
  if (detailed) {
    const normalized = detailed.replace(/^delayed:\s*/i, 'Delayed ').trim()
    if (normalized) return normalized
  }
  return 'Delayed'
}

/** Short label for tiny game boxes — always "Delayed"; reason lives in the tooltip. */
export function gameDelayLabelShort(game: Game): string | null {
  if (!isDelayed(game)) return null
  return 'Delayed'
}

/** MLB sometimes includes `reason` on delayed statuses. */
function gameStatusReason(game: Game): string | undefined {
  const reason = game.status.reason?.trim()
  if (reason) return reason
  const detailed = game.status.detailedState ?? ''
  const m = /^delayed:\s*(.+)$/i.exec(detailed.trim())
  return m?.[1]?.trim() || undefined
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

function completedOutcomeChar(series: Series, teamId: number): 'W' | 'L' | 'T' | null {
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

export function seriesStatsForTeam(seriesList: Series[], teamId: number): SeriesStats {
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

/** True when both clubs are listed as home in at least one game (e.g. London series). */
export function isHomeAndHomeSeries(series: Series): boolean {
  const homeIds = new Set(series.games.map((g) => g.teams.home.team.id))
  return homeIds.size > 1
}

/** Perspective matchup word: vs / @ / against (home-and-home). */
export function seriesOpponentPreposition(
  series: Series,
  perspectiveTeamId: number,
): 'vs' | '@' | 'against' {
  if (isHomeAndHomeSeries(series)) return 'against'
  return series.homeTeam.id === perspectiveTeamId ? 'vs' : '@'
}

export function isGameFinal(game: Game): boolean {
  return isFinal(game)
}

export function isGameLive(game: Game): boolean {
  return isLive(game)
}

export function isGameDelayed(game: Game): boolean {
  return isDelayed(game)
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
