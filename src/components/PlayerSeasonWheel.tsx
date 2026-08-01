import type { PersonStatSplit } from '@bp1222/stats-api'
import { Box, CircularProgress, Popover, Stack, SvgIcon, Typography } from '@mui/material'
import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import {
  useGameBatterAtBats,
  matchProvisionalToReal,
  type AtBatResultBucket,
  type GameAtBatContext,
  type SeasonWheelGameAtBats,
  type TrackedAtBat,
} from '../api/playerAtBats'
import { formatMonthDay } from '../lib/series'
import { getTeamColors } from '../lib/teamColors'
import { PitchLocationZone } from './PitchLocationZone'
import { TeamLogo } from './TeamLogo'

export type PlayerSeasonWheelProps = {
  personId: number
  teamId?: number
  season?: string
  /** Chronological games with provisional PAs from the game log (fixed layout). */
  games: SeasonWheelGameAtBats[]
  seasonSplit?: PersonStatSplit
  teamAbbrById?: Map<number, string>
}

const RESULT_COLORS: Record<AtBatResultBucket, string> = {
  hr: '#c41e3a',
  hit: '#1e4d8c',
  out: '#e0e0e0',
  walk: '#2e8b57',
  dnp: '#38444e',
}

/**
 * Polar season recap: each game is a spoke; each PA is a colored dot.
 * Dot positions come from game-log totals (fixed). Click loads that game's PBP
 * for pitch detail only — spokes do not reshuffle.
 */
export function PlayerSeasonWheel({
  personId,
  teamId,
  season,
  games,
  seasonSplit,
  teamAbbrById,
}: PlayerSeasonWheelProps) {
  const stat = seasonSplit?.stat
  const stats = stat
    ? (() => {
        const atBats = Number(stat.atBats ?? 0)
        const strikeOuts = Number(stat.strikeOuts ?? 0)
        const walks = Number(stat.baseOnBalls ?? 0)
        const hits = Number(stat.hits ?? 0)
        const homeRuns = Number(stat.homeRuns ?? 0)
        const doubles = Number(stat.doubles ?? 0)
        const triples = Number(stat.triples ?? 0)
        const singles = Math.max(0, hits - homeRuns - doubles - triples)

        return {
          avg: stat.avg as string | undefined,
          obp: stat.obp as string | undefined,
          slg: stat.slg as string | undefined,
          ops: stat.ops as string | undefined,
          gamesPlayed: stat.gamesPlayed as number | undefined,
          atBats,
          walks,
          strikeoutPct: atBats > 0 ? `${Math.round((strikeOuts / atBats) * 100)}%` : '—',
          stolenBases: stat.stolenBases as number | undefined,
          homeRuns,
          doubles,
          triples,
          singles,
        }
      })()
    : undefined

  const [loadedByGame, setLoadedByGame] = useState<Map<number, TrackedAtBat[]>>(
    () => new Map(),
  )
  const [selection, setSelection] = useState<{
    gamePk: number
    paIndex: number
    anchorPosition: { top: number; left: number }
  } | null>(null)

  useEffect(() => {
    setLoadedByGame(new Map())
    setSelection(null)
  }, [personId, season])

  const selectedGame = useMemo(
    () => (selection ? (games.find((g) => g.gamePk === selection.gamePk) ?? null) : null),
    [games, selection],
  )
  const selectedCtx: GameAtBatContext | null = selectedGame
    ? {
        gamePk: selectedGame.gamePk,
        date: selectedGame.date,
        opponentId: selectedGame.opponentId,
        opponentName: selectedGame.opponentName,
        isHome: selectedGame.isHome,
      }
    : null

  const cachedReal = selection ? loadedByGame.get(selection.gamePk) : undefined
  const needsFetch = Boolean(selection && !cachedReal)
  const pbpQuery = useGameBatterAtBats(personId, selectedCtx, needsFetch)

  useEffect(() => {
    if (!selection || !pbpQuery.atBats) return
    setLoadedByGame((prev) => {
      if (prev.has(selection.gamePk)) return prev
      const next = new Map(prev)
      next.set(selection.gamePk, pbpQuery.atBats!)
      return next
    })
  }, [selection, pbpQuery.atBats])

  const realAtBats = cachedReal ?? pbpQuery.atBats

  const detailAb = useMemo(() => {
    if (!selection || !selectedGame || !realAtBats) return null
    const provisional = selectedGame.atBats[selection.paIndex]
    return matchProvisionalToReal(
      provisional,
      selectedGame.atBats,
      selection.paIndex,
      realAtBats,
    )
  }, [selection, selectedGame, realAtBats])

  const size = 360
  const centerRadius = 120
  const dotRadius = 2.6
  const hitRadius = 3.4
  const dotSpacing = dotRadius * 2.35

  const totalGames = games.length
  const angleStep = (2 * Math.PI) / Math.max(totalGames, 1)
  const startAngle = -Math.PI / 2

  const handleDotClick = (
    event: MouseEvent<SVGGElement>,
    gamePk: number,
    paIndex: number,
  ) => {
    event.stopPropagation()
    setSelection({
      gamePk,
      paIndex,
      anchorPosition: { top: event.clientY, left: event.clientX },
    })
  }

  const closeDetail = () => setSelection(null)

  const detailReady = Boolean(realAtBats)
  const detailEmpty = detailReady && realAtBats!.length === 0
  const detailUnmatched = detailReady && realAtBats!.length > 0 && !detailAb

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        py: 1,
      }}
    >
      {season && (
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          {season} offensive recap
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        Click a PA for pitch location
      </Typography>

      <Box sx={{ position: 'relative', width: size, height: size, maxWidth: '100%' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
          {games.map((game, gameIndex) => {
            const angle = startAngle + gameIndex * angleStep
            const cx = size / 2
            const cy = size / 2
            const pas = game.atBats

            return (
              <g key={game.gamePk}>
                {pas.length === 0 ? (
                  <circle
                    cx={cx + Math.cos(angle) * (centerRadius + dotSpacing)}
                    cy={cy + Math.sin(angle) * (centerRadius + dotSpacing)}
                    r={dotRadius * 0.5}
                    fill={RESULT_COLORS.dnp}
                    opacity={0.4}
                  />
                ) : (
                  pas.map((ab, abIndex) => {
                    const distance = centerRadius + dotSpacing * (abIndex + 1)
                    const x = cx + Math.cos(angle) * distance
                    const y = cy + Math.sin(angle) * distance
                    const selected =
                      selection?.gamePk === game.gamePk && selection.paIndex === abIndex
                    return (
                      <AtBatDot
                        key={`${ab.gamePk}-${ab.atBatIndex ?? abIndex}-${abIndex}`}
                        ab={ab}
                        x={x}
                        y={y}
                        r={dotRadius}
                        hitR={hitRadius}
                        selected={selected}
                        onClick={(e) => handleDotClick(e, game.gamePk, abIndex)}
                      />
                    )
                  })
                )}
              </g>
            )
          })}
        </svg>

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: centerRadius * 2,
            height: centerRadius * 2,
            borderRadius: '50%',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {teamId != null ? <TeamLogo teamId={teamId} size={48} /> : null}
        </Box>

        {stats && <BaselineDiamond size={size} />}

        {stats && (
          <>
            <StatDiamond
              value={stats.doubles}
              label="2B"
              position="top"
              size={size}
              teamId={teamId}
            />
            <StatDiamond
              value={stats.triples}
              label="3B"
              position="left"
              size={size}
              teamId={teamId}
            />
            <StatDiamond
              value={stats.singles}
              label="1B"
              position="right"
              size={size}
              teamId={teamId}
            />
            <StatDiamond
              value={stats.homeRuns}
              label="HR"
              position="bottom"
              size={size}
              teamId={teamId}
              highlight
            />
          </>
        )}
      </Box>

      {stats && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2.5,
            mt: 0.5,
          }}
        >
          <StatItem value={stats.avg ?? '—'} label="AVG" />
          <StatItem value={stats.obp ?? '—'} label="OBP" />
          <StatItem value={stats.slg ?? '—'} label="SLG" />
          <StatItem value={stats.ops ?? '—'} label="OPS" />
        </Box>
      )}

      {stats && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2.5,
          }}
        >
          <StatItem value={stats.gamesPlayed ?? '—'} label="Games" small />
          <StatItem value={stats.atBats ?? '—'} label="AB" small />
          <StatItem
            value={
              stats.walks != null && stats.atBats
                ? `${Math.round((stats.walks / stats.atBats) * 100)}%`
                : '—'
            }
            label="BB"
            small
          />
          <StatItem value={stats.strikeoutPct} label="K" small />
          <StatItem value={stats.stolenBases ?? '—'} label="SB" small />
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mt: 1,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <LegendItem color={RESULT_COLORS.hr} label="HR" />
        <LegendItem color={RESULT_COLORS.hit} label="Hit" />
        <LegendItem color={RESULT_COLORS.out} label="Out" />
        <LegendItem color={RESULT_COLORS.walk} label="BB/HBP/SF" />
        <LegendItem color={RESULT_COLORS.dnp} label="DNP" />
      </Box>

      <Popover
        open={Boolean(selection)}
        anchorReference="anchorPosition"
        anchorPosition={selection?.anchorPosition}
        onClose={closeDetail}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: { p: 1.5, maxWidth: 240 },
          },
        }}
      >
        {needsFetch && !realAtBats && (pbpQuery.isLoading || pbpQuery.isFetching) ? (
          <Stack spacing={1} sx={{ alignItems: 'center', py: 1, minWidth: 160 }}>
            <CircularProgress size={22} />
            <Typography variant="caption" color="text.secondary">
              Loading pitch…
            </Typography>
          </Stack>
        ) : pbpQuery.isError && !detailAb ? (
          <Typography variant="caption" color="error">
            Couldn’t load play-by-play for this game.
          </Typography>
        ) : detailAb ? (
          <AtBatDetail ab={detailAb} teamAbbrById={teamAbbrById} />
        ) : detailEmpty ? (
          <Typography variant="caption" color="text.secondary">
            No tracked plate appearances for this game.
          </Typography>
        ) : detailUnmatched ? (
          <Typography variant="caption" color="text.secondary">
            Pitch location unavailable for this result.
          </Typography>
        ) : null}
      </Popover>
    </Box>
  )
}

function AtBatDot({
  ab,
  x,
  y,
  r,
  hitR,
  selected,
  onClick,
}: {
  ab: TrackedAtBat
  x: number
  y: number
  r: number
  hitR: number
  selected?: boolean
  onClick: (e: MouseEvent<SVGGElement>) => void
}) {
  return (
    <g style={{ cursor: 'pointer' }} onClick={onClick}>
      <circle cx={x} cy={y} r={hitR} fill="transparent" />
      <circle
        cx={x}
        cy={y}
        r={selected ? r + 0.8 : r}
        fill={RESULT_COLORS[ab.resultBucket]}
        stroke={selected ? '#142033' : undefined}
        strokeWidth={selected ? 1 : undefined}
      />
    </g>
  )
}

function AtBatDetail({
  ab,
  teamAbbrById,
}: {
  ab: TrackedAtBat
  teamAbbrById?: Map<number, string>
}) {
  const opp =
    (ab.opponentId != null ? teamAbbrById?.get(ab.opponentId) : undefined) ??
    opponentShort(ab.opponentName)
  const date = ab.date ? formatMonthDay(ab.date) : '—'
  const inn =
    ab.inning != null
      ? `${ab.halfInning === 'bottom' ? 'Bot' : 'Top'} ${ab.inning}`
      : null
  const pitch = ab.pitch
  const pitchLine = pitch
    ? [
        pitch.pitchType,
        pitch.startSpeed != null ? `${pitch.startSpeed.toFixed(1)} mph` : null,
        pitch.call,
      ]
        .filter(Boolean)
        .join(' · ')
    : null
  const count =
    pitch?.balls != null && pitch.strikes != null
      ? `${pitch.balls}-${pitch.strikes}`
      : null
  const bip =
    pitch?.exitVelocity != null
      ? [
          `EV ${pitch.exitVelocity.toFixed(1)} mph`,
          pitch.launchAngle != null ? `LA ${pitch.launchAngle.toFixed(0)}°` : null,
        ]
          .filter(Boolean)
          .join(' · ')
      : null

  return (
    <Stack spacing={1} sx={{ minWidth: 180 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
        {date}
        {opp ? ` · ${ab.isHome ? 'vs' : '@'} ${opp}` : ''}
        {inn ? ` · ${inn}` : ''}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
        {ab.resultDescription ?? ab.resultEvent ?? 'At bat'}
      </Typography>
      {pitchLine && (
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
          {pitchLine}
        </Typography>
      )}
      {count && (
        <Typography variant="caption" color="text.secondary">
          Count {count}
        </Typography>
      )}
      {bip && (
        <Typography variant="caption" color="text.secondary">
          {bip}
        </Typography>
      )}
      <PitchLocationZone pitch={pitch} />
    </Stack>
  )
}

function opponentShort(name?: string): string | undefined {
  if (!name) return undefined
  const parts = name.trim().split(/\s+/)
  return parts[parts.length - 1]
}

const BASELINE_OFFSET = 88

function BaselineDiamond({ size }: { size: number }) {
  const cx = size / 2
  const cy = size / 2
  const offset = BASELINE_OFFSET

  const top = { x: cx, y: cy - offset }
  const right = { x: cx + offset, y: cy }
  const bottom = { x: cx, y: cy + offset }
  const left = { x: cx - offset, y: cy }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <line
        x1={top.x}
        y1={top.y}
        x2={right.x}
        y2={right.y}
        stroke="#ccc"
        strokeWidth={1.5}
      />
      <line
        x1={right.x}
        y1={right.y}
        x2={bottom.x}
        y2={bottom.y}
        stroke="#ccc"
        strokeWidth={1.5}
      />
      <line
        x1={bottom.x}
        y1={bottom.y}
        x2={left.x}
        y2={left.y}
        stroke="#ccc"
        strokeWidth={1.5}
      />
      <line
        x1={left.x}
        y1={left.y}
        x2={top.x}
        y2={top.y}
        stroke="#ccc"
        strokeWidth={1.5}
      />
    </svg>
  )
}

function StatDiamond({
  value,
  label,
  position,
  size,
  teamId,
  highlight,
}: {
  value: number | string
  label: string
  position: 'top' | 'bottom' | 'left' | 'right'
  size: number
  teamId?: number
  highlight?: boolean
}) {
  const diamondSize = 36
  const offset = BASELINE_OFFSET
  const isHomePlate = position === 'bottom'

  const positions: Record<string, { top?: number; left?: number }> = {
    top: {
      top: size / 2 - offset - diamondSize / 2,
      left: size / 2 - diamondSize / 2,
    },
    bottom: {
      top: size / 2 + offset - diamondSize / 2,
      left: size / 2 - diamondSize / 2,
    },
    left: {
      top: size / 2 - diamondSize / 2,
      left: size / 2 - offset - diamondSize / 2,
    },
    right: {
      top: size / 2 - diamondSize / 2,
      left: size / 2 + offset - diamondSize / 2,
    },
  }

  if (isHomePlate) {
    const plateW = 40
    const plateH = 42
    const pos = positions[position]
    const cx = plateW / 2
    const pts = [
      `${cx - plateW * 0.45},${plateH * 0.05}`,
      `${cx + plateW * 0.45},${plateH * 0.05}`,
      `${cx + plateW * 0.45},${plateH * 0.55}`,
      `${cx},${plateH * 0.95}`,
      `${cx - plateW * 0.45},${plateH * 0.55}`,
    ].join(' ')

    const colors =
      teamId != null
        ? getTeamColors(teamId)
        : { primary: '#c41e3a', secondary: '#8b0000' }

    return (
      <Box
        sx={{
          position: 'absolute',
          top: (pos.top ?? 0) - (plateH - diamondSize) / 2,
          left: (pos.left ?? 0) - (plateW - diamondSize) / 2,
          width: plateW,
          height: plateH,
          pointerEvents: 'none',
        }}
      >
        <SvgIcon
          viewBox={`0 0 ${plateW} ${plateH}`}
          strokeWidth={2}
          sx={{
            height: plateH,
            width: plateW,
            position: 'absolute',
            top: 0,
            left: 0,
            fill: colors.primary,
            stroke: colors.secondary,
          }}
        >
          <polygon points={pts} />
        </SvgIcon>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: plateW,
            height: plateH * 0.85,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 0.5,
            pointerEvents: 'none',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: '0.8rem',
              color: highlight ? 'white' : 'text.primary',
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.55rem',
              color: highlight ? 'rgba(255,255,255,0.8)' : 'text.secondary',
            }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        ...positions[position],
        width: diamondSize,
        height: diamondSize,
        transform: 'rotate(45deg)',
        bgcolor: highlight ? '#c41e3a' : 'background.paper',
        border: '2px solid',
        borderColor: highlight ? '#8b0000' : 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          transform: 'rotate(-45deg)',
          textAlign: 'center',
          lineHeight: 0.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            fontSize: '0.8rem',
            color: highlight ? 'white' : 'text.primary',
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.55rem',
            color: highlight ? 'rgba(255,255,255,0.8)' : 'text.secondary',
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  )
}

function StatItem({
  value,
  label,
  small,
}: {
  value: string | number
  label: string
  small?: boolean
}) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: small ? 40 : 50 }}>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 700,
          fontSize: small ? '0.9rem' : '1.1rem',
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: small ? '0.6rem' : '0.7rem' }}
      >
        {label}
      </Typography>
    </Box>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: color,
        }}
      />
      <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
        {label}
      </Typography>
    </Box>
  )
}
