import { Box } from '@mui/material'
import { teamLogoUrl } from '../lib/logos'

type TeamLogoProps = {
  teamId: number
  alt?: string
  size?: number
}

export function TeamLogo({ teamId, alt = '', size = 40 }: TeamLogoProps) {
  return (
    <Box
      component="img"
      src={teamLogoUrl(teamId)}
      alt={alt}
      sx={{
        width: size,
        height: size,
        objectFit: 'contain',
        flexShrink: 0,
      }}
      loading="lazy"
    />
  )
}
