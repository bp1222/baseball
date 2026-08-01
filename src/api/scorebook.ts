import { useQuery } from '@tanstack/react-query'
import type { BoxscoreTeam, Play, PlayRunner, Plays, Player } from '@bp1222/stats-api'
import { useMemo } from 'react'
import { atBatQueryKeys } from './playerAtBats'
import { gamesApi } from './client'

export type HalfInning = 'top' | 'bottom'

export type BaseId = '1B' | '2B' | '3B' | 'score'

export type ScorebookBases = {
  first?: number
  second?: number
  third?: number
}

export type ScorebookRunnerMove = {
  runnerId: number
  runnerName: string
  /** null = batter leaving home */
  start: BaseId | null
  /** null with isOut = retired off the bases */
  end: BaseId | null
  /** Base they were put out at (when retiring on the bases) */
  outBase?: BaseId | null
  isOut: boolean
  outNumber?: number | null
  isScoringEvent: boolean
  rbi: boolean
  /** True when this advance was a stolen base */
  isStolenBase: boolean
  credits: Array<{ credit: string; positionCode?: string; positionAbbr?: string }>
}

export type ScorebookPA = {
  atBatIndex: number
  inning: number
  half: HalfInning
  batterId: number
  batterName: string
  /** 1–9 batting-order slot */
  slot: number
  resultEvent?: string
  resultEventType?: string
  resultDescription?: string
  /** Compact code for the cell (HR, 6-3, K, …) */
  resultCode: string
  isOut: boolean
  isScoringPlay: boolean
  rbi: number
  balls: number | null
  strikes: number | null
  showCount: boolean
  outsBefore: number
  outsAfter: number
  basesBefore: ScorebookBases
  basesAfter: ScorebookBases
  runners: ScorebookRunnerMove[]
  /** Out number(s) recorded on this PA for the batting team */
  outNumbers: number[]
  /**
   * True on the first PA after a different batter vacated the slot —
   * vertical sub line is drawn at the start of this (replacement) inning/PA.
   */
  startsWithSubstitution: boolean
}

export type ScorebookSlotStats = {
  ab: number
  h: number
  r: number
  rbi: number
}

export type ScorebookOccupant = {
  id: number
  label: string
  /** Starter for the slot (battingOrder …00) */
  isStarter: boolean
  stats: ScorebookSlotStats
}

export type ScorebookSlot = {
  slot: number
  /** Primary (starter) display name for the row */
  label: string
  /** Starter then substitutes, in batting-order / appearance order */
  occupants: ScorebookOccupant[]
  playerIds: number[]
}

export type ScorebookColumn = {
  /** Column key in `cells` (printed scorebook column number) */
  id: number
  /** Printed header digit */
  printed: number
  /** Actual inning recorded in this column */
  inning: number
  /** True when overflow/shift struck the printed number (e.g. ~~6~~ 5) */
  relabeled: boolean
}

export type ScorebookTeamBook = {
  side: 'away' | 'home'
  half: HalfInning
  slots: ScorebookSlot[]
  /** column id → slot → PAs in order (usually 0–1 PA per slot) */
  cells: Record<number, Record<number, ScorebookPA[]>>
  /** Left-to-right scorebook columns (may exceed 9 with overflows) */
  columns: ScorebookColumn[]
  runs: number
  hits: number
}

function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

function battingSlot(order: string | undefined): number | null {
  if (!order) return null
  const n = Number.parseInt(order, 10)
  if (!Number.isFinite(n) || n < 100) return null
  const slot = Math.floor(n / 100)
  return slot >= 1 && slot <= 9 ? slot : null
}

function isAtBat(play: Play): boolean {
  return play.result?.type === 'atBat'
}

function halfOf(play: Play): HalfInning {
  return play.about?.halfInning === 'bottom' ? 'bottom' : 'top'
}

function playerIdsOnTeam(team: BoxscoreTeam): Set<number> {
  const ids = new Set<number>()
  for (const p of Object.values(team.players ?? {})) {
    if (p.person?.id != null) ids.add(p.person.id)
  }
  return ids
}

function playerDisplayName(p: Player): string {
  const name =
    p.person?.boxscoreName ?? p.person?.fullName ?? `Player ${p.person?.id ?? ''}`
  const num = p.jerseyNumber?.trim()
  return num ? `${num} ${name}` : name
}

function lineupSlots(team: BoxscoreTeam): ScorebookSlot[] {
  const bySlot = new Map<number, Player[]>()
  for (const p of Object.values(team.players ?? {})) {
    const slot = battingSlot(p.battingOrder)
    if (slot == null) continue
    const list = bySlot.get(slot) ?? []
    list.push(p)
    bySlot.set(slot, list)
  }

  const slots: ScorebookSlot[] = []
  for (let slot = 1; slot <= 9; slot++) {
    const players = (bySlot.get(slot) ?? []).slice().sort((a, b) => {
      const ao = Number(a.battingOrder ?? 0)
      const bo = Number(b.battingOrder ?? 0)
      return ao - bo
    })
    const starter = players.find((p) => p.battingOrder?.endsWith('00')) ?? players[0]
    const occupants: ScorebookOccupant[] = players
      .map((p) => {
        const id = p.person?.id
        if (id == null) return null
        return {
          id,
          label: playerDisplayName(p),
          isStarter: Boolean(p.battingOrder?.endsWith('00')) || p === starter,
          stats: { ab: 0, h: 0, r: 0, rbi: 0 },
        }
      })
      .filter((o): o is ScorebookOccupant => o != null)
    // Prefer exactly one starter flag when multiple …00 somehow appear
    if (occupants.length > 0) {
      const starterId = starter?.person?.id
      for (const o of occupants) {
        o.isStarter = starterId != null ? o.id === starterId : o === occupants[0]
      }
    }
    const label =
      (starter ? playerDisplayName(starter) : null) ??
      occupants[0]?.label ??
      (players.length ? `Batter ${slot}` : `—`)
    slots.push({
      slot,
      label,
      occupants,
      playerIds: occupants.map((o) => o.id),
    })
  }
  return slots
}

function slotForBatter(
  batterId: number,
  team: BoxscoreTeam,
  fallbackByFirstSeen: Map<number, number>,
  nextFallback: { n: number },
): number {
  const player = team.players?.[`ID${batterId}`]
  const fromOrder = battingSlot(player?.battingOrder)
  if (fromOrder != null) return fromOrder
  const existing = fallbackByFirstSeen.get(batterId)
  if (existing != null) return existing
  const slot = ((nextFallback.n - 1) % 9) + 1
  nextFallback.n += 1
  fallbackByFirstSeen.set(batterId, slot)
  return slot
}

function normalizeBase(raw: string | null | undefined): BaseId | null {
  if (raw == null || raw === '') return null
  if (raw === '1B' || raw === '2B' || raw === '3B') return raw
  if (raw === 'score' || raw === 'home' || raw === '4B') return 'score'
  return null
}

function isStolenBaseMove(r: PlayRunner): boolean {
  const eventType = r.details?.eventType ?? ''
  const reason = r.details?.movementReason ?? ''
  return eventType.startsWith('stolen_base') || reason.includes('stolen_base')
}

function mapRunner(r: PlayRunner): ScorebookRunnerMove | null {
  const runner = r.details?.runner
  if (runner?.id == null) return null
  const start = normalizeBase(r.movement?.start ?? undefined)
  // Batter starts at home (null). Some payloads omit start for the batter.
  const startResolved =
    start ??
    (r.movement?.originBase
      ? normalizeBase(r.movement.originBase)
      : r.movement?.isOut && !r.movement?.start && !r.movement?.originBase
        ? null
        : null)
  let end = normalizeBase(r.movement?.end ?? undefined)
  if (r.details?.isScoringEvent && !end) end = 'score'
  if (r.movement?.isOut && end == null) {
    // Retired — keep end null
  }
  return {
    runnerId: runner.id,
    runnerName: runner.fullName ?? String(runner.id),
    start: startResolved,
    end,
    outBase: normalizeBase(r.movement?.outBase ?? undefined),
    isOut: Boolean(r.movement?.isOut),
    outNumber: r.movement?.outNumber ?? null,
    isScoringEvent: Boolean(r.details?.isScoringEvent),
    rbi: Boolean(r.details?.rbi),
    isStolenBase: isStolenBaseMove(r),
    credits: (r.credits ?? []).map((c) => ({
      credit: c.credit ?? '',
      positionCode: c.position?.code,
      positionAbbr: c.position?.abbreviation,
    })),
  }
}

function basesFromMatchup(play: Play): ScorebookBases {
  return {
    first: play.matchup?.postOnFirst?.id,
    second: play.matchup?.postOnSecond?.id,
    third: play.matchup?.postOnThird?.id,
  }
}

function emptyBases(): ScorebookBases {
  return {}
}

/** Classic fielder numbers from Stats API position codes. */
function positionNumber(code?: string, abbr?: string): string | null {
  if (code && /^[1-9]$/.test(code)) return code
  const map: Record<string, string> = {
    P: '1',
    C: '2',
    '1B': '3',
    '2B': '4',
    '3B': '5',
    SS: '6',
    LF: '7',
    CF: '8',
    RF: '9',
  }
  return abbr ? (map[abbr] ?? null) : null
}

function outNotationFromCredits(runners: ScorebookRunnerMove[]): string | null {
  // Prefer the batter's out credits; else any out with credits.
  const batterOut =
    runners.find((r) => r.isOut && r.start == null) ??
    runners.find((r) => r.isOut && r.credits.length > 0)
  if (!batterOut?.credits.length) return null

  const assists = batterOut.credits.filter((c) => c.credit === 'f_assist')
  const putouts = batterOut.credits.filter((c) => c.credit === 'f_putout')
  const ordered = [...assists, ...putouts]
  const nums = ordered
    .map((c) => positionNumber(c.positionCode, c.positionAbbr))
    .filter((n): n is string => Boolean(n))
  if (nums.length === 0) return null
  // Dedupe consecutive duplicates
  const deduped: string[] = []
  for (const n of nums) {
    if (deduped[deduped.length - 1] !== n) deduped.push(n)
  }
  return deduped.join('-')
}

const EVENT_CODE: Record<string, string> = {
  single: '1B',
  double: '2B',
  triple: '3B',
  home_run: 'HR',
  walk: 'BB',
  intent_walk: 'IBB',
  hit_by_pitch: 'HBP',
  strikeout: 'K',
  strikeout_double_play: 'K',
  sac_fly: 'SF',
  sac_bunt: 'SAC',
  field_error: 'E',
  catcher_interf: 'CI',
  fielders_choice: 'FC',
  double_play: 'DP',
  grounded_into_double_play: 'GDP',
  triple_play: 'TP',
  force_out: 'FO',
}

function resultCodeFor(play: Play, runners: ScorebookRunnerMove[]): string {
  const eventType = play.result?.eventType ?? ''
  const event = play.result?.event ?? ''

  if (eventType === 'strikeout' || event.toLowerCase().includes('strikeout')) {
    // Looking vs swinging is hard historically; plain K is fine.
    return 'K'
  }

  const mapped = EVENT_CODE[eventType]
  if (
    mapped &&
    mapped !== 'DP' &&
    eventType !== 'field_out' &&
    eventType !== 'force_out'
  ) {
    if (mapped === 'GDP' || mapped === 'DP' || mapped === 'TP' || mapped === 'FC') {
      const notation = outNotationFromCredits(runners)
      return notation ? `${mapped} ${notation}` : mapped
    }
    return mapped
  }

  if (
    eventType === 'field_out' ||
    eventType === 'force_out' ||
    eventType === 'double_play' ||
    eventType === 'grounded_into_double_play' ||
    eventType === 'triple_play' ||
    event === 'Batter Out'
  ) {
    const notation = outNotationFromCredits(runners)
    if (notation) {
      if (eventType === 'grounded_into_double_play') return `GDP ${notation}`
      if (eventType === 'double_play') return `DP ${notation}`
      if (eventType === 'triple_play') return `TP ${notation}`
      // Flyouts often only have putout — prefix F when trajectory says fly/popup
      const desc = (play.result?.description ?? '').toLowerCase()
      if (desc.includes('flies') || desc.includes('fly')) return `F${notation}`
      if (desc.includes('pops') || desc.includes('popup')) return `P${notation}`
      if (desc.includes('lines')) return `L${notation}`
      return notation
    }
    if (eventType === 'grounded_into_double_play') return 'GDP'
    if (eventType === 'double_play') return 'DP'
    return 'OUT'
  }

  if (mapped) return mapped

  // Fallback: shorten event name
  if (event) {
    const short = event
      .replace(/Grounded Into /i, 'GDP ')
      .replace(/Strikeout/i, 'K')
      .replace(/Home Run/i, 'HR')
    return short.length > 8 ? short.slice(0, 8) : short
  }
  return '?'
}

function pitchSequenceFidelity(play: Play): boolean {
  const pitches = (play.playEvents ?? []).filter((e) => e.isPitch)
  if (pitches.length >= 2) return true
  if (pitches.length === 1) {
    const c = pitches[0]?.count
    // Single synthetic 0-0 pitch is not a real sequence
    if ((c?.balls ?? 0) === 0 && (c?.strikes ?? 0) === 0) return false
    return true
  }
  return false
}

function shouldShowCount(play: Play, hasSequence: boolean): boolean {
  const balls = num(play.count?.balls)
  const strikes = num(play.count?.strikes)
  if (balls == null || strikes == null) return false
  if (hasSequence) return true
  const eventType = play.result?.eventType ?? ''
  // Walks / Ks often have reconstructed counts even without full sequences
  if (
    eventType === 'walk' ||
    eventType === 'intent_walk' ||
    eventType === 'strikeout' ||
    eventType === 'strikeout_double_play' ||
    eventType === 'hit_by_pitch'
  ) {
    return true
  }
  // Avoid lying with 0-0 on historical contact PAs
  if (balls === 0 && strikes === 0) return false
  return true
}

function playToPA(
  play: Play,
  slot: number,
  outsBefore: number,
  basesBefore: ScorebookBases,
): ScorebookPA {
  const runners = (play.runners ?? [])
    .map(mapRunner)
    .filter((r): r is ScorebookRunnerMove => r != null)

  // Ensure batter advance is represented when they reach safely without a runner row start
  const batterId = play.matchup?.batter?.id
  if (batterId != null) {
    const hasBatterMove = runners.some((r) => r.runnerId === batterId)
    if (!hasBatterMove && !play.result?.isOut) {
      const end: BaseId | null =
        play.result?.eventType === 'home_run'
          ? 'score'
          : play.result?.eventType === 'triple'
            ? '3B'
            : play.result?.eventType === 'double'
              ? '2B'
              : play.result?.eventType === 'single' ||
                  play.result?.eventType === 'walk' ||
                  play.result?.eventType === 'intent_walk' ||
                  play.result?.eventType === 'hit_by_pitch'
                ? '1B'
                : null
      if (end) {
        runners.unshift({
          runnerId: batterId,
          runnerName: play.matchup?.batter?.fullName ?? String(batterId),
          start: null,
          end,
          isOut: false,
          isScoringEvent: end === 'score',
          rbi: false,
          isStolenBase: false,
          credits: [],
        })
      }
    }
  }

  const hasSequence = pitchSequenceFidelity(play)
  const outNumbers = runners
    .map((r) => r.outNumber)
    .filter((n): n is number => typeof n === 'number')

  return {
    atBatIndex: play.about?.atBatIndex ?? play.atBatIndex ?? 0,
    inning: play.about?.inning ?? 0,
    half: halfOf(play),
    batterId: play.matchup?.batter?.id ?? 0,
    batterName:
      play.matchup?.batter?.fullName ?? play.matchup?.batter?.boxscoreName ?? 'Batter',
    slot,
    resultEvent: play.result?.event,
    resultEventType: play.result?.eventType,
    resultDescription: play.result?.description,
    resultCode: resultCodeFor(play, runners),
    isOut: Boolean(play.result?.isOut),
    isScoringPlay: Boolean(play.about?.isScoringPlay),
    rbi: play.result?.rbi ?? 0,
    balls: num(play.count?.balls),
    strikes: num(play.count?.strikes),
    showCount: shouldShowCount(play, hasSequence),
    outsBefore,
    outsAfter: play.count?.outs ?? outsBefore,
    basesBefore,
    basesAfter: basesFromMatchup(play),
    runners,
    outNumbers,
    startsWithSubstitution: false,
  }
}

const HIT_TYPES = new Set(['single', 'double', 'triple', 'home_run'])
const NON_AB_TYPES = new Set([
  'walk',
  'intent_walk',
  'hit_by_pitch',
  'sac_fly',
  'sac_bunt',
  'catcher_interf',
  'catcher_interference',
])

function countHits(pas: ScorebookPA[]): number {
  return pas.filter((p) => HIT_TYPES.has(p.resultEventType ?? '')).length
}

function countRuns(pas: ScorebookPA[]): number {
  let runs = 0
  for (const pa of pas) {
    for (const r of pa.runners) {
      if (r.isScoringEvent || r.end === 'score') runs += 1
    }
  }
  return runs
}

function slotStatsFromPas(pas: ScorebookPA[]): ScorebookSlotStats {
  let ab = 0
  let h = 0
  let r = 0
  let rbi = 0
  for (const pa of pas) {
    const t = pa.resultEventType ?? ''
    if (!NON_AB_TYPES.has(t)) ab += 1
    if (HIT_TYPES.has(t)) h += 1
    rbi += pa.rbi
    if (
      pa.runners.some(
        (mv) => mv.runnerId === pa.batterId && (mv.isScoringEvent || mv.end === 'score'),
      )
    ) {
      r += 1
    }
  }
  return { ab, h, r, rbi }
}

/**
 * Mark the first PA of each incoming batter in a slot (sub line at that inning),
 * and ensure occupants list includes everyone who actually batted.
 */
function applySubstitutions(
  slots: ScorebookSlot[],
  allPas: ScorebookPA[],
  team: BoxscoreTeam,
): void {
  for (const slot of slots) {
    const pas = allPas.filter((pa) => pa.slot === slot.slot)
    for (let i = 0; i < pas.length - 1; i++) {
      const cur = pas[i]!
      const next = pas[i + 1]!
      if (cur.batterId !== next.batterId && cur.batterId > 0 && next.batterId > 0) {
        // Line marks the inning where the replacement enters (first PA of new batter).
        next.startsWithSubstitution = true
      }
    }

    // Append batters who appeared but weren't on the boxscore battingOrder list
    for (const pa of pas) {
      if (pa.batterId <= 0) continue
      if (!slot.occupants.some((o) => o.id === pa.batterId)) {
        const boxPlayer = team.players?.[`ID${pa.batterId}`]
        slot.occupants.push({
          id: pa.batterId,
          label: boxPlayer ? playerDisplayName(boxPlayer) : pa.batterName,
          isStarter: slot.occupants.length === 0,
          stats: { ab: 0, h: 0, r: 0, rbi: 0 },
        })
        slot.playerIds.push(pa.batterId)
      }
      if (slot.label === '—' && pa.batterName) {
        const boxPlayer = team.players?.[`ID${pa.batterId}`]
        slot.label = boxPlayer ? playerDisplayName(boxPlayer) : pa.batterName
      }
    }
  }
}

/**
 * Classic scorebook: each runner's path lives on the diamond where they
 * reached base, not on later batters' squares. Redistribute non-batter
 * advances onto the open PA for that runner.
 */
function attributeRunnerPaths(pas: ScorebookPA[]): void {
  const open = new Map<number, ScorebookPA>()

  for (const pa of pas) {
    const all = pa.runners
    const batterId = pa.batterId
    const batterMoves = all.filter((r) => r.runnerId === batterId)
    const otherMoves = all.filter((r) => r.runnerId !== batterId)

    pa.runners = [...batterMoves]

    for (const move of otherMoves) {
      const owner = open.get(move.runnerId)
      if (owner) owner.runners.push(move)
      if (move.isOut || move.end === 'score' || move.isScoringEvent) {
        open.delete(move.runnerId)
      }
    }

    const stillOn = batterMoves.some(
      (r) => !r.isOut && r.end != null && r.end !== 'score',
    )
    if (stillOn) {
      open.set(batterId, pa)
    } else {
      open.delete(batterId)
    }

    pa.outNumbers = pa.runners
      .map((r) => r.outNumber)
      .filter((n): n is number => typeof n === 'number')
  }
}

/**
 * Build one team's classic scorebook matrix from play-by-play + boxscore lineup.
 *
 * When a lineup turns over in the same inning (10th+ batter), PAs spill into the
 * next column. That column’s printed number is struck and the true inning is
 * written (e.g. ~~6~~ 5). Later innings shift right the same way.
 */
export function buildScorebook(
  plays: Plays | undefined,
  team: BoxscoreTeam,
  side: 'away' | 'home',
): ScorebookTeamBook {
  const half: HalfInning = side === 'away' ? 'top' : 'bottom'
  const slots = lineupSlots(team)
  const teamIds = playerIdsOnTeam(team)
  const fallbackByFirstSeen = new Map<number, number>()
  const nextFallback = { n: 1 }

  const cells: Record<number, Record<number, ScorebookPA[]>> = {}
  const allPas: ScorebookPA[] = []

  // Pre-print columns 1–9; claim left-to-right as innings (and overflows) need them.
  const columns: ScorebookColumn[] = []
  for (let i = 1; i <= 9; i++) {
    columns.push({ id: i, printed: i, inning: i, relabeled: false })
  }

  const columnEmpty = (colId: number): boolean => {
    const bySlot = cells[colId]
    if (!bySlot) return true
    return Object.values(bySlot).every((pas) => pas.length === 0)
  }

  const slotFilled = (colId: number, slot: number): boolean =>
    (cells[colId]?.[slot]?.length ?? 0) > 0

  const claimNextColumn = (inning: number): ScorebookColumn => {
    for (const col of columns) {
      if (columnEmpty(col.id)) {
        col.inning = inning
        col.relabeled = col.printed !== inning
        return col
      }
    }
    const printed = columns.length + 1
    const col: ScorebookColumn = {
      id: printed,
      printed,
      inning,
      relabeled: printed !== inning,
    }
    columns.push(col)
    return col
  }

  /** Current column being filled for each inning */
  const activeColByInning = new Map<number, number>()

  let outsBefore = 0
  let basesBefore = emptyBases()
  let prevHalf: HalfInning | null = null
  let prevInning: number | null = null

  for (const play of plays?.allPlays ?? []) {
    if (!isAtBat(play)) continue
    const playHalf = halfOf(play)
    const inning = play.about?.inning ?? 0
    if (inning < 1) continue

    if (playHalf !== prevHalf || inning !== prevInning) {
      outsBefore = 0
      basesBefore = emptyBases()
      prevHalf = playHalf
      prevInning = inning
    }

    const batterId = play.matchup?.batter?.id

    // Half-inning ownership: top = away, bottom = home
    if (playHalf !== half) {
      outsBefore = play.count?.outs ?? outsBefore
      basesBefore = basesFromMatchup(play)
      continue
    }
    if (batterId != null && teamIds.size > 0 && !teamIds.has(batterId)) {
      outsBefore = play.count?.outs ?? outsBefore
      basesBefore = basesFromMatchup(play)
      continue
    }

    const slot = slotForBatter(batterId ?? 0, team, fallbackByFirstSeen, nextFallback)
    const pa = playToPA(play, slot, outsBefore, basesBefore)

    let colId = activeColByInning.get(inning)
    if (colId == null) {
      colId = claimNextColumn(inning).id
      activeColByInning.set(inning, colId)
    } else if (slotFilled(colId, slot)) {
      // Lineup turned over in this inning — spill into the next column.
      colId = claimNextColumn(inning).id
      activeColByInning.set(inning, colId)
    }

    if (!cells[colId]) cells[colId] = {}
    if (!cells[colId]![slot]) cells[colId]![slot] = []
    cells[colId]![slot]!.push(pa)
    allPas.push(pa)

    outsBefore = pa.outsAfter
    basesBefore = pa.basesAfter
  }

  attributeRunnerPaths(allPas)

  applySubstitutions(slots, allPas, team)

  for (const slot of slots) {
    for (const occ of slot.occupants) {
      occ.stats = slotStatsFromPas(
        allPas.filter((pa) => pa.slot === slot.slot && pa.batterId === occ.id),
      )
    }
  }

  // Drop trailing unused pre-printed columns beyond 9 only if… keep at least 1–9.
  // Columns beyond 9 that are empty can be trimmed; 1–9 stay for a full book page.
  while (columns.length > 9) {
    const last = columns[columns.length - 1]!
    if (!columnEmpty(last.id)) break
    columns.pop()
  }

  return {
    side,
    half,
    slots,
    cells,
    columns,
    runs: countRuns(allPas),
    hits: countHits(allPas),
  }
}

export function useGamePlayByPlay(gamePk: number, enabled: boolean) {
  return useQuery({
    queryKey: atBatQueryKeys.playByPlay(gamePk),
    queryFn: () => gamesApi.getGamePlayByPlay({ gamePk }),
    enabled: enabled && gamePk > 0,
    staleTime: 1000 * 60 * 30,
  })
}

export function useGameScorebook(
  gamePk: number,
  team: BoxscoreTeam | undefined,
  side: 'away' | 'home',
  enabled: boolean,
  seedPlays?: Plays | undefined,
) {
  const hasSeed = Boolean(seedPlays?.allPlays?.length)
  const pbp = useGamePlayByPlay(gamePk, enabled && !hasSeed)
  const plays = hasSeed ? seedPlays : pbp.data

  const book = useMemo(() => {
    if (!team || !plays?.allPlays?.length) return null
    return buildScorebook(plays, team, side)
  }, [plays, team, side])

  return {
    book,
    isLoading: enabled && !hasSeed && (pbp.isLoading || pbp.isFetching),
    isFetching: pbp.isFetching,
    isError: !hasSeed && pbp.isError && !book,
    error: pbp.error,
    hasPlays: Boolean(plays?.allPlays?.length),
  }
}
