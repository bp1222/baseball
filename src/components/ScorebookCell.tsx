import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { BaseId, ScorebookPA, ScorebookRunnerMove } from '../api/scorebook'

type ScorebookCellProps = {
  pas: ScorebookPA[]
}

/**
 * Fills its CSS grid track. PA content stays inset; the end-of-inning slash may
 * bleed into the next column/row. Isolated so chrome doesn't cover sticky headers.
 */
export function ScorebookCell({ pas }: ScorebookCellProps) {
  const hasEndOfInning = pas.some((pa) => pa.outsAfter >= 3)
  const hasPinchRunner = pas.some((pa) =>
    pa.runners.some((r) => r.pinchRunnerEntryAt != null),
  )
  const allowBleed = hasEndOfInning || hasPinchRunner
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        borderRight: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        // Inning-end slash and PR marks may sit on / past the base corner.
        overflow: allowBleed ? 'visible' : 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        position: 'relative',
        zIndex: allowBleed ? 2 : 0,
        isolation: 'isolate',
      }}
    >
      {pas.length === 0 ? (
        <EmptyPaBox />
      ) : (
        pas.map((pa) => <PaBox key={pa.atBatIndex} pa={pa} />)
      )}
    </Box>
  )
}

const CELL_HEADER_H = 12

function CellHeader({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: CELL_HEADER_H,
        boxSizing: 'border-box',
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'grey.50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: '3px',
        minWidth: 0,
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center' }}>{left}</Box>
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{right}</Box>
    </Box>
  )
}

function EmptyPaBox() {
  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        minHeight: 0,
        width: '100%',
      }}
    >
      <CellHeader />
    </Box>
  )
}

function PaBox({ pa }: { pa: ScorebookPA }) {
  const journey = journeyFromMoves(pa.runners)
  // Corner slash marks the PA that ended the inning, not every square that
  // recorded the third out (e.g. a pickoff attributed back to a runner).
  const endOfInning = pa.outsAfter >= 3
  const allowBleed = endOfInning || journey.pinchRunnerAt != null
  const outLabel = pa.outNumbers.length > 0 ? String(Math.max(...pa.outNumbers)) : null
  const isK =
    pa.resultCode === 'K' ||
    pa.resultCode === 'Kb' ||
    Boolean(pa.resultEventType?.startsWith('strikeout'))
  const isLookingK = pa.resultCode === 'Kb'
  const multilineCode = pa.resultCode.includes('\n')

  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        minHeight: 0,
        width: '100%',
        overflow: allowBleed ? 'visible' : 'hidden',
      }}
      title={pa.resultDescription ?? pa.resultEvent ?? pa.resultCode}
    >
      {pa.startsWithSubstitution && (
        <Box
          aria-hidden
          title="Substitution"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 3,
            bgcolor: 'text.primary',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />
      )}

      <CellHeader
        left={
          pa.rbi > 0 ? (
            <Box
              sx={{
                width: 9,
                height: 9,
                boxSizing: 'border-box',
                border: '1.25px solid',
                borderColor: 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
              title={`${pa.rbi} RBI`}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.45rem',
                  fontWeight: 800,
                  color: 'error.main',
                  lineHeight: 1,
                  pointerEvents: 'none',
                }}
              >
                {pa.rbi}
              </Typography>
            </Box>
          ) : null
        }
        right={
          outLabel ? (
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: 1,
                borderColor: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.48rem',
                  fontWeight: 800,
                  color: 'text.primary',
                  lineHeight: 1,
                  pointerEvents: 'none',
                }}
              >
                {outLabel}
              </Typography>
            </Box>
          ) : null
        }
      />

      <Box
        sx={{
          position: 'absolute',
          top: CELL_HEADER_H,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: '8%',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minWidth: 0,
            minHeight: 0,
          }}
        >
          {pa.resultCode ? (
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: isLookingK
                  ? 'translate(-50%, -50%) scaleX(-1)'
                  : 'translate(-50%, -50%)',
                zIndex: 0,
                fontWeight: 800,
                fontSize: multilineCode
                  ? '0.5rem'
                  : pa.resultCode.length > 5
                    ? '0.55rem'
                    : isK
                      ? '0.85rem'
                      : '0.68rem',
                lineHeight: multilineCode ? 1.15 : 1,
                color: isK ? 'error.main' : 'text.primary',
                pointerEvents: 'none',
                whiteSpace: multilineCode ? 'pre-line' : 'nowrap',
                textAlign: 'center',
                maxWidth: '85%',
                overflow: 'hidden',
                textOverflow: multilineCode ? 'clip' : 'ellipsis',
              }}
            >
              {isLookingK ? 'K' : pa.resultCode}
            </Typography>
          ) : null}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <DiamondSvg journey={journey} />
          </Box>
        </Box>
      </Box>

      {pa.showCount && pa.balls != null && pa.strikes != null && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 2,
            left: 3,
            zIndex: 3,
            fontSize: '0.48rem',
            fontWeight: 600,
            color: 'text.secondary',
            lineHeight: 1,
            pointerEvents: 'none',
          }}
        >
          {pa.balls}-{pa.strikes}
        </Typography>
      )}

      {endOfInning && (
        <Box
          component="svg"
          viewBox="0 0 28 28"
          sx={{
            position: 'absolute',
            // Short corner mark that still bleeds a bit into the next
            // column and the row below.
            right: -7,
            bottom: -7,
            width: 28,
            height: 28,
            zIndex: 6,
            overflow: 'visible',
            pointerEvents: 'none',
          }}
          aria-hidden
        >
          {/* `/` through the bottom-right corner (18,18). */}
          <line
            x1={8}
            y1={28}
            x2={28}
            y2={8}
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
          />
        </Box>
      )}
    </Box>
  )
}

type Journey = {
  segs: [boolean, boolean, boolean, boolean]
  /** Segments advanced via stolen base (same indices as segs) */
  stolenSegs: [boolean, boolean, boolean, boolean]
  /** Lineup # of batter who advanced this runner on that segment */
  advanceLabels: [string | null, string | null, string | null, string | null]
  scored: boolean
  /** Out while advancing toward this base level (slash mid-path) */
  outOnAdvance: number | null
  /** Put out while occupying this base (pickoff) — slash through the path at the base */
  outAtBase: number | null
  /** Base level (1–3) where a pinch-runner entered */
  pinchRunnerAt: number | null
}

function levelOf(base: BaseId | null | undefined): number {
  if (base == null) return 0
  if (base === '1B') return 1
  if (base === '2B') return 2
  if (base === '3B') return 3
  return 4
}

function markSegRange(
  flags: [boolean, boolean, boolean, boolean],
  start: BaseId | null,
  end: BaseId | null,
) {
  const startLvl = levelOf(start)
  const endLvl = levelOf(end)
  for (let lvl = startLvl + 1; lvl <= endLvl; lvl++) {
    const idx = lvl - 1
    if (idx >= 0 && idx < 4) flags[idx] = true
  }
}

function markAdvanceLabels(
  labels: [string | null, string | null, string | null, string | null],
  start: BaseId | null,
  end: BaseId | null,
  label: string,
) {
  const startLvl = levelOf(start)
  const endLvl = levelOf(end)
  for (let lvl = startLvl + 1; lvl <= endLvl; lvl++) {
    const idx = lvl - 1
    if (idx >= 0 && idx < 4 && labels[idx] == null) labels[idx] = label
  }
}

function journeyFromMoves(moves: ScorebookRunnerMove[]): Journey {
  let maxSafe = 0
  let outOnAdvance: number | null = null
  let outAtBase: number | null = null
  let pinchRunnerAt: number | null = null
  let scored = false
  const stolenSegs: [boolean, boolean, boolean, boolean] = [false, false, false, false]
  const advanceLabels: [string | null, string | null, string | null, string | null] = [
    null,
    null,
    null,
    null,
  ]

  for (const m of moves) {
    if (m.pinchRunnerEntryAt && pinchRunnerAt == null) {
      const lvl = levelOf(m.pinchRunnerEntryAt)
      if (lvl >= 1 && lvl <= 3) pinchRunnerAt = lvl
    }
    if (m.isOut && m.start != null) {
      const toward = m.outBase ?? m.end ?? nextBaseAfter(m.start)
      const startLvl = levelOf(m.start)
      const towardLvl = levelOf(toward)
      if (startLvl > maxSafe) maxSafe = startLvl

      // Pickoff / out at the occupied base: keep the path to that base and
      // slash through it at the base. Force outs while advancing get mid-path slash.
      const outAtOccupiedBase =
        m.isPickoff ||
        (m.outBase != null && m.outBase === m.start) ||
        towardLvl <= startLvl

      if (outAtOccupiedBase) {
        outAtBase = startLvl
      } else {
        outOnAdvance = towardLvl
      }
      continue
    }
    if (m.isOut && m.start == null) continue
    const endLvl = levelOf(m.end)
    if (endLvl > maxSafe) maxSafe = endLvl
    if (m.isScoringEvent || m.end === 'score') scored = true
    if (m.isStolenBase && !m.isOut) {
      markSegRange(stolenSegs, m.start, m.end)
    } else if (m.advancedBySlot != null && m.advancedBySlot > 0 && !m.isOut) {
      markAdvanceLabels(advanceLabels, m.start, m.end, String(m.advancedBySlot))
    }
  }

  if (scored) maxSafe = 4
  return {
    segs: [maxSafe >= 1, maxSafe >= 2, maxSafe >= 3, maxSafe >= 4 || scored],
    stolenSegs,
    advanceLabels,
    scored: scored || maxSafe >= 4,
    outOnAdvance,
    outAtBase,
    pinchRunnerAt,
  }
}

function nextBaseAfter(start: BaseId): BaseId {
  if (start === '1B') return '2B'
  if (start === '2B') return '3B'
  return 'score'
}

/** Path segment that arrives at a base level (1=home→1B, …). */
function pathIntoBase(
  level: number,
): { x1: number; y1: number; x2: number; y2: number } | null {
  const pts: Record<number, { x1: number; y1: number; x2: number; y2: number }> = {
    1: { x1: 36, y1: 62, x2: 62, y2: 36 },
    2: { x1: 62, y1: 36, x2: 36, y2: 10 },
    3: { x1: 36, y1: 10, x2: 10, y2: 36 },
    4: { x1: 10, y1: 36, x2: 36, y2: 62 },
  }
  return pts[level] ?? null
}

function DiamondSvg({ journey }: { journey: Journey }) {
  // Inset points so stroke stays inside the viewBox
  const home = { x: 36, y: 62 }
  const first = { x: 62, y: 36 }
  const second = { x: 36, y: 10 }
  const third = { x: 10, y: 36 }
  const poly = `${home.x},${home.y} ${first.x},${first.y} ${second.x},${second.y} ${third.x},${third.y}`
  const edges = [
    {
      a: home,
      b: first,
      on: journey.segs[0] && journey.outOnAdvance !== 1,
      sb: journey.stolenSegs[0],
      label: journey.advanceLabels[0],
    },
    {
      a: first,
      b: second,
      on: journey.segs[1] && journey.outOnAdvance !== 2,
      sb: journey.stolenSegs[1],
      label: journey.advanceLabels[1],
    },
    {
      a: second,
      b: third,
      on: journey.segs[2] && journey.outOnAdvance !== 3,
      sb: journey.stolenSegs[2],
      label: journey.advanceLabels[2],
    },
    {
      a: third,
      b: home,
      on: journey.segs[3] && journey.outOnAdvance !== 4,
      sb: journey.stolenSegs[3],
      label: journey.advanceLabels[3],
    },
  ]

  return (
    <svg
      viewBox="0 0 72 72"
      width="100%"
      height="100%"
      aria-hidden
      style={{
        display: 'block',
        overflow: journey.pinchRunnerAt != null ? 'visible' : 'hidden',
      }}
    >
      {journey.scored && (
        <polygon points={poly} fill="rgba(196, 30, 58, 0.14)" stroke="none" />
      )}
      <polygon points={poly} fill="none" stroke="rgba(20, 32, 51, 0.2)" strokeWidth={1} />
      {edges.map((e, i) => {
        if (!e.on) return null
        const mx = (e.a.x + e.b.x) / 2
        const my = (e.a.y + e.b.y) / 2
        const dx = e.b.x - e.a.x
        const dy = e.b.y - e.a.y
        const len = Math.sqrt(dx * dx + dy * dy) || 1
        // Outward normal (diamond center is ~36,36)
        let nx = -dy / len
        let ny = dx / len
        const cx = 36
        const cy = 36
        if ((mx - cx) * nx + (my - cy) * ny < 0) {
          nx = -nx
          ny = -ny
        }
        return (
          <g key={i}>
            <line
              x1={e.a.x}
              y1={e.a.y}
              x2={e.b.x}
              y2={e.b.y}
              stroke={journey.scored ? '#c41e3a' : '#142033'}
              strokeWidth={2}
              strokeLinecap="round"
            />
            {e.sb && (
              <text
                x={mx + nx * 9}
                y={my + ny * 9}
                fill="#142033"
                fontSize={11}
                fontWeight={700}
                fontFamily="system-ui, sans-serif"
                textAnchor="middle"
                dominantBaseline="central"
              >
                sb
              </text>
            )}
            {!e.sb && e.label && (
              <text
                x={mx + nx * 9}
                y={my + ny * 9}
                fill="#142033"
                fontSize={11}
                fontWeight={700}
                fontFamily="system-ui, sans-serif"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {e.label}
              </text>
            )}
          </g>
        )
      })}
      {journey.outOnAdvance != null && <OutOnAdvanceMark level={journey.outOnAdvance} />}
      {journey.outAtBase != null && <OutAtBaseMark level={journey.outAtBase} />}
      {journey.pinchRunnerAt != null && <PinchRunnerMark level={journey.pinchRunnerAt} />}
    </svg>
  )
}

/** `PR` just outside the base where a pinch-runner entered. */
function PinchRunnerMark({ level }: { level: number }) {
  const p = pathIntoBase(level)
  if (!p) return null
  // Outside the base corner (away from diamond center).
  const dx = p.x2 - 36
  const dy = p.y2 - 36
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  return (
    <text
      x={p.x2 + (dx / len) * 9}
      y={p.y2 + (dy / len) * 9}
      fill="#142033"
      fontSize={9}
      fontWeight={800}
      fontFamily="system-ui, sans-serif"
      textAnchor="middle"
      dominantBaseline="central"
    >
      PR
    </text>
  )
}

/** Slash through the path at the occupied base (pickoff). */
function OutAtBaseMark({ level }: { level: number }) {
  const p = pathIntoBase(level)
  if (!p) return null
  // Center on the base corner itself (not down the path toward home).
  const mx = p.x2
  const my = p.y2
  // Orient by base: horizontal at 1B/3B, vertical at 2B (and home).
  const half = 4.5
  const horizontal = level === 1 || level === 3
  return (
    <line
      x1={horizontal ? mx - half : mx}
      y1={horizontal ? my : my - half}
      x2={horizontal ? mx + half : mx}
      y2={horizontal ? my : my + half}
      stroke="#142033"
      strokeWidth={1.75}
      strokeLinecap="round"
    />
  )
}

function OutOnAdvanceMark({ level }: { level: number }) {
  const p = pathIntoBase(level)
  if (!p) return null
  const mx = (p.x1 + p.x2) / 2
  const my = (p.y1 + p.y2) / 2
  const dx = p.x2 - p.x1
  const dy = p.y2 - p.y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = (-dy / len) * 4
  const ny = (dx / len) * 4
  return (
    <g>
      <line
        x1={p.x1}
        y1={p.y1}
        x2={mx}
        y2={my}
        stroke="#142033"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <line
        x1={mx - nx}
        y1={my - ny}
        x2={mx + nx}
        y2={my + ny}
        stroke="#142033"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </g>
  )
}
