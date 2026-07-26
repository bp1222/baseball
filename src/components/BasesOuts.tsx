import { Box } from '@mui/material'
import type { BaseOccupancy } from '../lib/linescore'

type Size = 'sm' | 'md'

const sizeSx = {
  sm: { svg: { width: 11, height: 10 }, dot: 3.5, gap: '1.5px' },
  md: { svg: { width: 22, height: 20 }, dot: 7, gap: '3px' },
} as const

export function BasePaths({ bases, size = 'sm' }: { bases: BaseOccupancy; size?: Size }) {
  const occupied = 'currentColor'
  const open = 'transparent'
  const dims = sizeSx[size].svg
  return (
    <Box
      component="svg"
      // Pad the viewBox so stroke on 1st/3rd bases isn’t clipped at the edges.
      viewBox="-1.5 -0.5 19 15"
      aria-hidden
      sx={{ ...dims, display: 'block', flexShrink: 0, overflow: 'visible' }}
    >
      <polygon
        points="8,1 11,4 8,7 5,4"
        fill={bases.second ? occupied : open}
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <polygon
        points="3,6 6,9 3,12 0,9"
        fill={bases.third ? occupied : open}
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <polygon
        points="13,6 16,9 13,12 10,9"
        fill={bases.first ? occupied : open}
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </Box>
  )
}

export function OutsDots({ outs, size = 'sm' }: { outs: number; size?: Size }) {
  const filled = Math.max(0, Math.min(3, outs))
  const { dot, gap } = sizeSx[size]
  return (
    <Box sx={{ display: 'flex', gap, alignItems: 'center' }} aria-hidden>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: dot,
            height: dot,
            borderRadius: '50%',
            bgcolor: i < filled ? 'currentColor' : 'transparent',
            border: '1px solid currentColor',
          }}
        />
      ))}
    </Box>
  )
}
