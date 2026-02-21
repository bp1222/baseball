import {Box} from '@mui/material'

import {Team} from '@/types/Team'

export const GetTeamImage = (team?: Team, dead?: boolean) => {
  if (team == undefined) return null

  let teamId = team.id
  let src = 'https://www.mlbstatic.com/team-logos/team-cap-on-light/' + teamId + '.svg'

  // Teams in 4xxx range are returned for teams in the postseason before
  // a specific team qualifies for the spot. Problem is the images served
  // for the teams aren't always the right league. So we hardcode to
  // known good images for the leagues.
  if (team.id > 1000) {
    if (team.league == 104) {
      teamId = 4619
    }
    if (team.league == 103) {
      teamId = 4944
    }
    src = 'https://midfield.mlbstatic.com/v1/team/' + teamId + '/spots/128'
  }

  return (
    <Box
      component="img"
      src={src}
      sx={{
        filter: dead ? 'grayscale(1)' : undefined,
        height: 24,
        width: 24,
        display: 'block',
        objectFit: 'contain',
      }}
      alt={team.name}
    />
  )
}
