import { Box } from '@mui/material'

import type { SpringLeague } from '@/types/Series'

type SpringLeagueIconProps = {
  league: SpringLeague
}

export const SpringLeagueIcon = ({ league }: SpringLeagueIconProps) => {
  const src = league === 'grapefruit' ? '/assets/grapefruit.png' : '/assets/cactus.png'
  const alt = league === 'grapefruit' ? 'Grapefruit League' : 'Cactus League'

  return (
    <Box
      component="img"
      src={src}
      sx={{
        width: 16,
        height: 16,
        display: 'block',
        objectFit: 'contain',
      }}
      alt={alt}
    />
  )
}
