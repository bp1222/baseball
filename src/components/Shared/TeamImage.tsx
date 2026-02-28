import { Box, BoxProps, Tooltip } from '@mui/material'

import type { Team } from '@/types/Team'

type TeamImageProps = BoxProps & {
  team?: Team
  dead?: boolean
  size?: number
}

export const TeamImage = ({ team, dead, size }: TeamImageProps) => {
  if (!team) {
    return null
  }

  let teamId = team.id
  let src = 'https://www.mlbstatic.com/team-logos/team-cap-on-light/' + teamId + '.svg'

  // Teams in 4xxx range are returned for teams in the postseason before
  // a specific team qualifies for the spot. Problem is the images served
  // for the teams aren't always the right league. So we hardcode to
  // known good images for the leagues.
  if (teamId > 1000) {
    if (team.league == 104) {
      teamId = 4619
    }
    if (team.league == 103) {
      teamId = 4944
    }
    src = 'https://midfield.mlbstatic.com/v1/team/' + teamId + '/spots/128'
  }

  const sizePx = size ?? 24
  return (
    <Tooltip title={team.name} enterDelay={500} enterNextDelay={500} leaveDelay={200}>
      <Box
        component="img"
        src={src}
        width={sizePx}
        height={sizePx}
        loading="lazy"
        sx={{
          filter: dead ? 'grayscale(1)' : undefined,
          height: sizePx,
          width: sizePx,
          display: 'block',
          objectFit: 'contain',
        }}
        alt={team.name}
      />
    </Tooltip>
  )
}
