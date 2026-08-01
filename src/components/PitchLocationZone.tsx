import { Box, Typography } from '@mui/material'
import type { PitchMeta } from '../api/playerAtBats'

type PitchLocationZoneProps = {
  pitch: PitchMeta | null
  width?: number
  height?: number
}

/** Catcher's-view mini strike zone with deciding-pitch location. */
export function PitchLocationZone({
  pitch,
  width = 120,
  height = 160,
}: PitchLocationZoneProps) {
  const padX = 18
  const padY = 16
  const plotW = width - padX * 2
  const plotH = height - padY * 2

  // Horizontal: pX feet from center (− = catcher's right / batter's left for RHH view is inverted;
  // MLB pX is from catcher's perspective: negative = to catcher's left.
  const xMin = -1.5
  const xMax = 1.5
  const plateHalf = 0.708 // ~17"/2 in feet

  const szTop = pitch?.strikeZoneTop ?? 3.5
  const szBottom = pitch?.strikeZoneBottom ?? 1.5
  // Vertical frame with a little air above/below the zone
  const yMin = Math.min(szBottom - 0.6, 0.5)
  const yMax = Math.max(szTop + 0.6, 4.2)

  const toX = (pX: number) => padX + ((pX - xMin) / (xMax - xMin)) * plotW
  const toY = (pZ: number) => padY + ((yMax - pZ) / (yMax - yMin)) * plotH

  const zoneLeft = toX(-plateHalf)
  const zoneRight = toX(plateHalf)
  const zoneTop = toY(szTop)
  const zoneBottom = toY(szBottom)

  const hasLoc = pitch != null && pitch.pX != null && pitch.pZ != null
  const rawX = hasLoc ? toX(pitch.pX!) : 0
  const rawY = hasLoc ? toY(pitch.pZ!) : 0
  const dotX = Math.min(width - 6, Math.max(6, rawX))
  const dotY = Math.min(height - 6, Math.max(6, rawY))
  const outside = hasLoc && (dotX !== rawX || dotY !== rawY)

  return (
    <Box sx={{ width, mx: 'auto' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={6}
          fill="#f5f7fa"
          stroke="#d0d7e2"
        />

        {/* Strike zone */}
        <rect
          x={zoneLeft}
          y={zoneTop}
          width={zoneRight - zoneLeft}
          height={zoneBottom - zoneTop}
          fill="rgba(20, 32, 51, 0.04)"
          stroke="#142033"
          strokeWidth={1.25}
        />
        {/* Zone thirds */}
        <line
          x1={zoneLeft + (zoneRight - zoneLeft) / 3}
          y1={zoneTop}
          x2={zoneLeft + (zoneRight - zoneLeft) / 3}
          y2={zoneBottom}
          stroke="#9aa6b5"
          strokeWidth={0.5}
        />
        <line
          x1={zoneLeft + (2 * (zoneRight - zoneLeft)) / 3}
          y1={zoneTop}
          x2={zoneLeft + (2 * (zoneRight - zoneLeft)) / 3}
          y2={zoneBottom}
          stroke="#9aa6b5"
          strokeWidth={0.5}
        />
        <line
          x1={zoneLeft}
          y1={zoneTop + (zoneBottom - zoneTop) / 3}
          x2={zoneRight}
          y2={zoneTop + (zoneBottom - zoneTop) / 3}
          stroke="#9aa6b5"
          strokeWidth={0.5}
        />
        <line
          x1={zoneLeft}
          y1={zoneTop + (2 * (zoneBottom - zoneTop)) / 3}
          x2={zoneRight}
          y2={zoneTop + (2 * (zoneBottom - zoneTop)) / 3}
          stroke="#9aa6b5"
          strokeWidth={0.5}
        />

        {/* Home plate (bottom) */}
        <polygon
          points={[
            `${(zoneLeft + zoneRight) / 2},${height - 4}`,
            `${zoneLeft},${height - 14}`,
            `${zoneLeft},${height - 20}`,
            `${zoneRight},${height - 20}`,
            `${zoneRight},${height - 14}`,
          ].join(' ')}
          fill="#fff"
          stroke="#142033"
          strokeWidth={1}
        />

        {hasLoc ? (
          <circle
            cx={dotX}
            cy={dotY}
            r={outside ? 4.5 : 5}
            fill={outside ? '#a33b2a' : '#c41e3a'}
            stroke="#fff"
            strokeWidth={1.25}
            opacity={outside ? 0.85 : 1}
          />
        ) : null}
      </svg>
      {!hasLoc && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 0.5, fontSize: '0.65rem' }}
        >
          Pitch location unavailable
        </Typography>
      )}
    </Box>
  )
}
