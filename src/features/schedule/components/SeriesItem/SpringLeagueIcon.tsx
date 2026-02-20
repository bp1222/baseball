import { Box } from '@mui/material'
import { useState } from 'react'

import type { SpringLeague } from '@/types/Series'

type SpringLeagueIconProps = {
  league: SpringLeague
  /** Size in pixels (default 28) */
  size?: number
}

/** Small grapefruit or cactus icon. Uses GIF from public/ if present, else inline SVG. */
export const SpringLeagueIcon = ({ league, size = 28 }: SpringLeagueIconProps) => {
  const [imgFailed, setImgFailed] = useState(false)
  const gifSrc = league === 'grapefruit' ? '/grapefruit.gif' : '/cactus.gif'
  const alt =
    league === 'grapefruit'
      ? 'Grapefruit League – Spring training, Florida'
      : 'Cactus League – Spring training, Arizona'

  if (!imgFailed) {
    return (
      <Box
        component="img"
        src={gifSrc}
        alt={alt}
        sx={{
          width: size,
          height: size,
          display: 'block',
          objectFit: 'contain',
        }}
        onError={() => setImgFailed(true)}
      />
    )
  }

  // SVG fallback when GIF is missing or fails
  const s = size
  if (league === 'grapefruit') {
    return (
      <Box
        component="svg"
        width={s}
        height={s}
        viewBox="0 0 32 32"
        fill="none"
        sx={{ display: 'block' }}
        role="img"
        aria-label={alt}
      >
        <title>{alt}</title>
        <circle cx="16" cy="16" r="12" fill="#FFB74D" stroke="#F57C00" strokeWidth="1.5" />
        <ellipse cx="16" cy="14" rx="4" ry="3" fill="#FFCC80" opacity={0.9} />
      </Box>
    )
  }
  return (
    <Box
      component="svg"
      width={s}
      height={s}
      viewBox="0 0 32 32"
      fill="none"
      sx={{ display: 'block' }}
      role="img"
      aria-label={alt}
    >
      <title>{alt}</title>
      <path
        d="M16 4c-2 0-3 2-3 4v2c0 2 1 4 3 4s3-2 3-4V8c0-2-1-4-3-4z"
        fill="#2E7D32"
        stroke="#1B5E20"
        strokeWidth="1"
      />
      <path d="M16 14v14M12 18h8M10 22h12M11 26h10" stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="8" r="2" fill="#66BB6A" />
    </Box>
  )
}
