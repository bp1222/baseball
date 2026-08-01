import { useQuery } from '@tanstack/react-query'
import type { PersonStatSplit, Play, PlayEvent, Plays } from '@bp1222/stats-api'
import { useMemo } from 'react'
import { gamesApi } from './client'

export type AtBatResultBucket = 'hr' | 'hit' | 'out' | 'walk' | 'dnp'

export type PitchMeta = {
  pX: number | null
  pZ: number | null
  zone: number | null
  strikeZoneTop: number
  strikeZoneBottom: number
  startSpeed: number | null
  pitchType: string | null
  call: string | null
  description: string | null
  balls: number | null
  strikes: number | null
  exitVelocity: number | null
  launchAngle: number | null
}

export type TrackedAtBat = {
  gamePk: number
  date?: string
  opponentId?: number
  opponentName?: string
  isHome?: boolean
  inning?: number
  halfInning?: string
  atBatIndex?: number
  resultBucket: AtBatResultBucket
  resultEvent?: string
  resultDescription?: string
  pitch: PitchMeta | null
  /** True when built from game-log totals rather than play-by-play. */
  provisional?: boolean
}

export type SeasonWheelGameAtBats = {
  gamePk: number
  date?: string
  opponentId?: number
  opponentName?: string
  isHome?: boolean
  atBats: TrackedAtBat[]
  /** Real PAs loaded for this game (click-to-fetch). */
  loaded?: boolean
}

export type GameAtBatContext = {
  gamePk: number
  date?: string
  opponentId?: number
  opponentName?: string
  isHome?: boolean
}

const WALK_EVENTS = new Set([
  'walk',
  'intent_walk',
  'hit_by_pitch',
  'sac_fly',
  'sac_bunt',
  'catcher_interf',
])

const HIT_EVENTS = new Set(['single', 'double', 'triple'])

export function resultBucketFromEventType(eventType?: string): AtBatResultBucket {
  if (!eventType) return 'out'
  if (eventType === 'home_run') return 'hr'
  if (HIT_EVENTS.has(eventType)) return 'hit'
  if (WALK_EVENTS.has(eventType)) return 'walk'
  return 'out'
}

function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null
}

function extractDecidingPitch(events: PlayEvent[] | undefined): PitchMeta | null {
  if (!events?.length) return null
  let last: PlayEvent | undefined
  for (const e of events) {
    if (e.isPitch) last = e
  }
  if (!last) return null

  const pitchData = last.pitchData ?? {}
  const coords = (pitchData.coordinates ?? {}) as Record<string, unknown>
  const details = last.details ?? {}
  const count = last.count ?? {}
  const hitData = last.hitData ?? {}
  const pitchType = details.type as { description?: string; code?: string } | undefined
  const call = details.call as { description?: string; code?: string } | undefined

  return {
    pX: num(coords.pX),
    pZ: num(coords.pZ),
    zone: num(pitchData.zone),
    strikeZoneTop: num(pitchData.strikeZoneTop) ?? 3.5,
    strikeZoneBottom: num(pitchData.strikeZoneBottom) ?? 1.5,
    startSpeed: num(pitchData.startSpeed),
    pitchType: str(pitchType?.description) ?? str(pitchType?.code),
    call: str(call?.description) ?? str(details.description),
    description: str(details.description),
    balls: num(count.balls),
    strikes: num(count.strikes),
    exitVelocity: num(hitData.launchSpeed),
    launchAngle: num(hitData.launchAngle),
  }
}

export function extractBatterAtBats(
  plays: Plays | undefined,
  personId: number,
  ctx: GameAtBatContext,
): TrackedAtBat[] {
  const out: TrackedAtBat[] = []
  for (const play of plays?.allPlays ?? []) {
    if (!isBatterAtBat(play, personId)) continue
    const eventType = play.result?.eventType
    out.push({
      gamePk: ctx.gamePk,
      date: ctx.date,
      opponentId: ctx.opponentId,
      opponentName: ctx.opponentName,
      isHome: ctx.isHome,
      inning: play.about?.inning,
      halfInning: play.about?.halfInning,
      atBatIndex: play.about?.atBatIndex ?? play.atBatIndex,
      resultBucket: resultBucketFromEventType(eventType),
      resultEvent: play.result?.event,
      resultDescription: play.result?.description,
      pitch: extractDecidingPitch(play.playEvents),
      provisional: false,
    })
  }
  return out
}

function isBatterAtBat(play: Play, personId: number): boolean {
  if (play.result?.type !== 'atBat') return false
  return play.matchup?.batter?.id === personId
}

/** Colored PA placeholders from a game-log line (instant wheel; not chronological). */
export function deriveProvisionalAtBats(
  stat: Record<string, unknown> | undefined,
  ctx: GameAtBatContext,
): TrackedAtBat[] {
  if (!stat) return []
  const homeRuns = Number(stat.homeRuns ?? 0)
  const triples = Number(stat.triples ?? 0)
  const doubles = Number(stat.doubles ?? 0)
  const hits = Number(stat.hits ?? 0)
  const singles = Math.max(0, hits - homeRuns - triples - doubles)
  const walks =
    Number(stat.baseOnBalls ?? 0) +
    Number(stat.hitByPitch ?? 0) +
    Number(stat.sacFlies ?? 0) +
    Number(stat.sacBunts ?? 0)
  const outs = Math.max(0, Number(stat.atBats ?? 0) - hits)

  const buckets: AtBatResultBucket[] = []
  for (let i = 0; i < homeRuns; i++) buckets.push('hr')
  for (let i = 0; i < triples; i++) buckets.push('hit')
  for (let i = 0; i < doubles; i++) buckets.push('hit')
  for (let i = 0; i < singles; i++) buckets.push('hit')
  for (let i = 0; i < walks; i++) buckets.push('walk')
  for (let i = 0; i < outs; i++) buckets.push('out')

  return buckets.map((resultBucket, i) => ({
    gamePk: ctx.gamePk,
    date: ctx.date,
    opponentId: ctx.opponentId,
    opponentName: ctx.opponentName,
    isHome: ctx.isHome,
    atBatIndex: i,
    resultBucket,
    pitch: null,
    provisional: true,
  }))
}

/**
 * Map a game-log placeholder PA to a real PBP PA by result bucket + ordinal
 * within that bucket (layout stays fixed; chronology may differ).
 */
export function matchProvisionalToReal(
  provisional: TrackedAtBat | undefined,
  provisionalList: TrackedAtBat[],
  provisionalIndex: number,
  real: TrackedAtBat[] | undefined,
): TrackedAtBat | null {
  if (!provisional || !real?.length) return null
  const bucket = provisional.resultBucket
  let ordinal = 0
  for (let i = 0; i < provisionalIndex; i++) {
    if (provisionalList[i]?.resultBucket === bucket) ordinal += 1
  }
  const same = real.filter((ab) => ab.resultBucket === bucket)
  if (same.length === 0) return null
  return same[Math.min(ordinal, same.length - 1)] ?? null
}

/** Chronological season-wheel games from the hitting game log (no PBP yet). */
export function seasonWheelGamesFromLog(
  splits: PersonStatSplit[] | undefined,
): SeasonWheelGameAtBats[] {
  if (!splits?.length) return []
  const seen = new Set<number>()
  const list: SeasonWheelGameAtBats[] = []
  for (const split of splits) {
    const gamePk = split.game?.gamePk
    if (gamePk == null || seen.has(gamePk)) continue
    seen.add(gamePk)
    const ctx: GameAtBatContext = {
      gamePk,
      date: split.date,
      opponentId: split.opponent?.id,
      opponentName: split.opponent?.name,
      isHome: split.isHome,
    }
    list.push({
      ...ctx,
      atBats: deriveProvisionalAtBats(
        split.stat as Record<string, unknown> | undefined,
        ctx,
      ),
      loaded: false,
    })
  }
  list.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
  return list
}

export const atBatQueryKeys = {
  playByPlay: (gamePk: number) => ['gamePlayByPlay', gamePk] as const,
}

/**
 * Fetch one game's play-by-play and extract a batter's plate appearances.
 * Cached by gamePk so revisiting a spoke is free.
 */
export function useGameBatterAtBats(
  personId: number | null,
  ctx: GameAtBatContext | null,
  enabled: boolean,
) {
  const gamePk = ctx?.gamePk
  const query = useQuery({
    queryKey: atBatQueryKeys.playByPlay(gamePk ?? 0),
    queryFn: () => gamesApi.getGamePlayByPlay({ gamePk: gamePk! }),
    enabled: enabled && personId != null && personId > 0 && gamePk != null && gamePk > 0,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const atBats = useMemo(() => {
    if (!query.data || !ctx || personId == null) return undefined
    return extractBatterAtBats(query.data, personId, ctx)
  }, [query.data, ctx, personId])

  return {
    atBats,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
  }
}
