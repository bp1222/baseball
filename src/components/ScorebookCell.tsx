import { Box, Typography } from '@mui/material'
import type { BaseId, ScorebookPA, ScorebookRunnerMove } from '../api/scorebook'

type ScorebookCellProps = {
  pas: ScorebookPA[]
}

/**
 * Fills its CSS grid track completely. All drawing stays clipped inside.
 * Isolated stacking so PA chrome never paints over sticky headers/labels.
 */
export function ScorebookCell({ pas }: ScorebookCellProps) {
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
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        position: 'relative',
        zIndex: 0,
        isolation: 'isolate',
      }}
    >
      {pas.length === 0 ? null : pas.map((pa) => <PaBox key={pa.atBatIndex} pa={pa} />)}
    </Box>
  )
}

function PaBox({ pa }: { pa: ScorebookPA }) {
  const journey = journeyFromMoves(pa.runners)
  // Corner slash marks the PA that ended the inning, not every square that
  // recorded the third out (e.g. a pickoff attributed back to a runner).
  const endOfInning = pa.outsAfter >= 3
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
        overflow: 'hidden',
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
      <Box
        sx={{
          position: 'absolute',
          inset: '12%',
          zIndex: 1,
        }}
      >
        <DiamondSvg journey={journey} />
      </Box>

      <Typography
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: isLookingK
            ? 'translate(-50%, -50%) scaleX(-1)'
            : 'translate(-50%, -50%)',
          zIndex: 3,
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
          bgcolor: 'background.paper',
          px: 0.25,
          borderRadius: 0.5,
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

      {pa.rbi > 0 && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: 2,
            left: 3,
            zIndex: 3,
            fontSize: '0.5rem',
            fontWeight: 700,
            color: 'error.main',
            lineHeight: 1,
            pointerEvents: 'none',
          }}
        >
          {pa.rbi === 1 ? 'RBI' : `${pa.rbi} RBI`}
        </Typography>
      )}

      {outLabel && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: 2,
            right: 3,
            zIndex: 3,
            fontSize: '0.5rem',
            fontWeight: 700,
            color: 'text.secondary',
            lineHeight: 1,
            pointerEvents: 'none',
          }}
        >
          {outLabel}
        </Typography>
      )}

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
          viewBox="0 0 64 64"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 4,
            pointerEvents: 'none',
          }}
          aria-hidden
        >
          {/* Corner slash fully inside the box */}
          <line
            x1={44}
            y1={64}
            x2={64}
            y2={44}
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
  scored: boolean
  /** Out while advancing toward this base level (slash mid-path) */
  outOnAdvance: number | null
  /** Put out while occupying this base (pickoff) — slash through the path at the base */
  outAtBase: number | null
}

function levelOf(base: BaseId | null | undefined): number {
  if (base == null) return 0
  if (base === '1B') return 1
  if (base === '2B') return 2
  if (base === '3B') return 3
  return 4
}

function markStolenSegs(
  stolen: [boolean, boolean, boolean, boolean],
  start: BaseId | null,
  end: BaseId | null,
) {
  const startLvl = levelOf(start)
  const endLvl = levelOf(end)
  for (let lvl = startLvl + 1; lvl <= endLvl; lvl++) {
    const idx = lvl - 1
    if (idx >= 0 && idx < 4) stolen[idx] = true
  }
}

function journeyFromMoves(moves: ScorebookRunnerMove[]): Journey {
  let maxSafe = 0
  let outOnAdvance: number | null = null
  let outAtBase: number | null = null
  let scored = false
  const stolenSegs: [boolean, boolean, boolean, boolean] = [false, false, false, false]

  for (const m of moves) {
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
      markStolenSegs(stolenSegs, m.start, m.end)
    }
  }

  if (scored) maxSafe = 4
  return {
    segs: [maxSafe >= 1, maxSafe >= 2, maxSafe >= 3, maxSafe >= 4 || scored],
    stolenSegs,
    scored: scored || maxSafe >= 4,
    outOnAdvance,
    outAtBase,
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
    },
    {
      a: first,
      b: second,
      on: journey.segs[1] && journey.outOnAdvance !== 2,
      sb: journey.stolenSegs[1],
    },
    {
      a: second,
      b: third,
      on: journey.segs[2] && journey.outOnAdvance !== 3,
      sb: journey.stolenSegs[2],
    },
    {
      a: third,
      b: home,
      on: journey.segs[3] && journey.outOnAdvance !== 4,
      sb: journey.stolenSegs[3],
    },
  ]

  return (
    <svg
      viewBox="0 0 72 72"
      width="100%"
      height="100%"
      aria-hidden
      style={{ display: 'block', overflow: 'hidden' }}
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
                x={mx + nx * 7}
                y={my + ny * 7}
                fill="#142033"
                fontSize={7}
                fontWeight={700}
                fontFamily="system-ui, sans-serif"
                textAnchor="middle"
                dominantBaseline="central"
              >
                sb
              </text>
            )}
          </g>
        )
      })}
      {journey.outOnAdvance != null && <OutOnAdvanceMark level={journey.outOnAdvance} />}
      {journey.outAtBase != null && <OutAtBaseMark level={journey.outAtBase} />}
    </svg>
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
