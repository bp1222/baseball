import { Box, Tooltip } from '@mui/material'

import type { SpringLeague } from '@/types/Series'

type SpringLeagueIconProps = {
  league: SpringLeague
}

export const SpringLeagueIcon = ({ league }: SpringLeagueIconProps) => {
  const src = league === 'grapefruit' ? '/assets/grapefruit.png' : '/assets/cactus.png'
  const alt = league === 'grapefruit' ? 'Grapefruit League' : 'Cactus League'

  return (
    <Tooltip title={alt} enterDelay={500} enterNextDelay={500} leaveDelay={200}>
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: 16,
          height: 16,
          display: 'inline-block',
          lineHeight: 0,
        }}
      />
    </Tooltip>
  )
}
