import type { PersonStatSplit } from '@bp1222/stats-api'
import { Box, styled, SvgIcon, Typography } from '@mui/material'
import { useMemo } from 'react'

import { TeamImage } from '@/components/Shared/TeamImage.tsx'
import { getTheme } from '@/theme'
import type { GameLogSplit } from '@/types/GameLogSplit'
import { Team } from '@/types/Team.ts'

export type AtBatResult = 'hr' | 'hit' | 'out' | 'walk' | 'dnp'

export type PlayerSeasonWheelProps = {
  playerName: string
  team?: Team
  season?: string
  gameLog: GameLogSplit[]
  seasonSplit?: PersonStatSplit
}

const RESULT_COLORS: Record<AtBatResult, string> = {
  hr: '#c41e3a',
  hit: '#1e4d8c',
  out: '#b8c4ce',
  walk: '#2e8b57',
  dnp: '#e0e0e0',
}

function deriveAtBatsFromStat(stat: Record<string, unknown>): AtBatResult[] {
  const atBats: AtBatResult[] = []

  const homeRuns = Number(stat.homeRuns ?? 0)
  const triples = Number(stat.triples ?? 0)
  const doubles = Number(stat.doubles ?? 0)
  const hits = Number(stat.hits ?? 0)
  const singles = hits - homeRuns - triples - doubles

  const walks = Number(stat.baseOnBalls ?? 0)
  const hbp = Number(stat.hitByPitch ?? 0)
  const sacFlies = Number(stat.sacFlies ?? 0)
  const sacBunts = Number(stat.sacBunts ?? 0)

  const totalAtBats = Number(stat.atBats ?? 0)
  const outs = totalAtBats - hits

  for (let i = 0; i < homeRuns; i++) atBats.push('hr')
  for (let i = 0; i < triples; i++) atBats.push('hit')
  for (let i = 0; i < doubles; i++) atBats.push('hit')
  for (let i = 0; i < singles; i++) atBats.push('hit')
  for (let i = 0; i < walks + hbp + sacFlies + sacBunts; i++) atBats.push('walk')
  for (let i = 0; i < outs; i++) atBats.push('out')

  return atBats
}

export const PlayerSeasonWheel = ({ playerName, team, season, gameLog, seasonSplit }: PlayerSeasonWheelProps) => {
  const games = useMemo(() => {
    return gameLog.map((split) => ({
      gamePk: split.game?.gamePk,
      date: split.date,
      atBats: split.stat ? deriveAtBatsFromStat(split.stat) : [],
    }))
  }, [gameLog])

  const stats = useMemo(() => {
    const stat = seasonSplit?.stat
    if (!stat) return undefined

    const atBats = Number(stat.atBats ?? 0)
    const strikeOuts = Number(stat.strikeOuts ?? 0)
    const walks = Number(stat.baseOnBalls ?? 0)
    const hits = Number(stat.hits ?? 0)
    const homeRuns = Number(stat.homeRuns ?? 0)
    const doubles = Number(stat.doubles ?? 0)
    const triples = Number(stat.triples ?? 0)
    const singles = hits - homeRuns - doubles - triples

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
  }, [seasonSplit])

  const size = 400
  const centerRadius = 140
  const dotRadius = 2.55
  const dotSpacing = dotRadius * 2.3

  const totalGames = games.length
  const angleStep = (2 * Math.PI) / Math.max(totalGames, 1)
  const startAngle = -Math.PI / 2

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        p: 2,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.7rem' }}
      >
        Opening Day
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', mb: 1 }}>
        Continue Clockwise to Next Game
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        {playerName}
      </Typography>
      {season && (
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mb: 1 }}>
          {season} Offensive Recap Including Detailed At-Bat Results
        </Typography>
      )}

      <Box sx={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {games.map((game, gameIndex) => {
            const angle = startAngle + gameIndex * angleStep
            const cx = size / 2
            const cy = size / 2

            return (
              <g key={game.gamePk ?? gameIndex}>
                {game.atBats.length === 0 ? (
                  <circle
                    cx={cx + Math.cos(angle) * (centerRadius + dotSpacing)}
                    cy={cy + Math.sin(angle) * (centerRadius + dotSpacing)}
                    r={dotRadius * 0.5}
                    fill={RESULT_COLORS.dnp}
                    opacity={0.4}
                  />
                ) : (
                  game.atBats.map((result, abIndex) => {
                    const distance = centerRadius + dotSpacing * (abIndex + 1)
                    const x = cx + Math.cos(angle) * distance
                    const y = cy + Math.sin(angle) * distance

                    return <circle key={abIndex} cx={x} cy={y} r={dotRadius} fill={RESULT_COLORS[result]} />
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
          }}
        >
          <TeamImage team={team} size={48} />
        </Box>

        {stats && <BaselineDiamond size={size} />}

        {stats && (
          <>
            <StatDiamond value={stats.doubles} label="2B" position="top" size={size} team={team} />
            <StatDiamond value={stats.triples} label="3B" position="left" size={size} team={team} />
            <StatDiamond value={stats.singles} label="1B" position="right" size={size} team={team} />
            <StatDiamond value={stats.homeRuns} label="HR" position="bottom" size={size} team={team} highlight />
          </>
        )}
      </Box>

      {stats && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 3,
            mt: 1,
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
            gap: 3,
            mt: 0.5,
          }}
        >
          <StatItem value={stats.gamesPlayed ?? '—'} label="Games" small />
          <StatItem value={stats.atBats ?? '—'} label="AB" small />
          <StatItem
            value={stats.walks != null && stats.atBats ? `${Math.round((stats.walks / stats.atBats) * 100)}%` : '—'}
            label="BB"
            small
          />
          <StatItem value={stats.strikeoutPct} label="K" small />
          <StatItem value={stats.stolenBases ?? '—'} label="SB" small />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <LegendItem color={RESULT_COLORS.hr} label="HR" />
        <LegendItem color={RESULT_COLORS.hit} label="Hit" />
        <LegendItem color={RESULT_COLORS.out} label="Out" />
        <LegendItem color={RESULT_COLORS.walk} label="BB/HBP/SF" />
        <LegendItem color={RESULT_COLORS.dnp} label="Did Not Play" />
      </Box>
    </Box>
  )
}

const BASELINE_OFFSET = 100

type BaselineDiamondProps = {
  size: number
}

const BaselineDiamond = ({ size }: BaselineDiamondProps) => {
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
      <line x1={top.x} y1={top.y} x2={right.x} y2={right.y} stroke="#ccc" strokeWidth={1.5} />
      <line x1={right.x} y1={right.y} x2={bottom.x} y2={bottom.y} stroke="#ccc" strokeWidth={1.5} />
      <line x1={bottom.x} y1={bottom.y} x2={left.x} y2={left.y} stroke="#ccc" strokeWidth={1.5} />
      <line x1={left.x} y1={left.y} x2={top.x} y2={top.y} stroke="#ccc" strokeWidth={1.5} />
    </svg>
  )
}

type StatDiamondProps = {
  value: number | string
  label: string
  position: 'top' | 'bottom' | 'left' | 'right'
  size: number
  team: Team
  highlight?: boolean
}

const StatDiamond = ({ value, label, position, size, team, highlight }: StatDiamondProps) => {
  const diamondSize = 38
  const offset = BASELINE_OFFSET
  const isHomePlate = position === 'bottom'

  const positions: Record<string, { top?: number; left?: number }> = {
    top: { top: size / 2 - offset - diamondSize / 2, left: size / 2 - diamondSize / 2 },
    bottom: { top: size / 2 + offset - diamondSize / 2, left: size / 2 - diamondSize / 2 },
    left: { top: size / 2 - diamondSize / 2, left: size / 2 - offset - diamondSize / 2 },
    right: { top: size / 2 - diamondSize / 2, left: size / 2 + offset - diamondSize / 2 },
  }

  if (isHomePlate) {
    const plateW = 42
    const plateH = 44
    const pos = positions[position]
    const cx = plateW / 2
    // Pentagon: flat top edge, angled sides, point at bottom
    const pts = [
      `${cx - plateW * 0.45},${plateH * 0.05}`,
      `${cx + plateW * 0.45},${plateH * 0.05}`,
      `${cx + plateW * 0.45},${plateH * 0.55}`,
      `${cx},${plateH * 0.95}`,
      `${cx - plateW * 0.45},${plateH * 0.55}`,
    ].join(' ')

    const teamTheme = getTheme(team.id)
    const StyledSvgIcon = styled(SvgIcon)(() => ({
      fill: teamTheme.palette.primary.main,
      stroke: teamTheme.palette.secondary.main,
    }))
    return (
      <Box
        sx={{
          position: 'absolute',
          top: (pos.top ?? 0) - (plateH - diamondSize) / 2,
          left: (pos.left ?? 0) - (plateW - diamondSize) / 2,
          width: plateW,
          height: plateH,
        }}
      >
        <StyledSvgIcon
          viewBox={`0 0 ${plateW} ${plateH}`}
          strokeWidth={2}
          sx={{
            height: plateH,
            width: plateW,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <polygon points={pts} />
        </StyledSvgIcon>
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

type StatItemProps = {
  value: string | number
  label: string
  small?: boolean
}

const StatItem = ({ value, label, small }: StatItemProps) => (
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
    <Typography variant="caption" color="text.secondary" sx={{ fontSize: small ? '0.6rem' : '0.7rem' }}>
      {label}
    </Typography>
  </Box>
)

type LegendItemProps = {
  color: string
  label: string
}

const LegendItem = ({ color, label }: LegendItemProps) => (
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
