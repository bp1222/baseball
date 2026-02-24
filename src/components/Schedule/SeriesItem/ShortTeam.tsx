import {Grid, Typography} from '@mui/material'

import {TeamImage} from '@/components/Shared/TeamImage.tsx'
import {Team} from '@/types/Team.ts'

type ShortTeamProps = {
  team?: Team
  dead?: boolean
  /** When false, only show logo (e.g. in non-team series view). Default true. */
  showAbbreviation?: boolean
}

const ShortTeam = ({ team, dead, showAbbreviation = true }: ShortTeamProps) => {
  if (team == undefined) return
  const isTbd = /[\d/]/

  return (
    <Grid container justifyContent="center" alignItems="center" flexDirection="column" sx={{ minWidth: 0 }}>
      <Typography fontSize="smaller" noWrap sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <TeamImage team={team} dead={dead} />
        {showAbbreviation &&
          (isTbd.test(team.abbreviation ?? '') ? 'TBD' : (team.abbreviation?.toUpperCase() ?? 'TBD'))}
      </Typography>
    </Grid>
  )
}

export default ShortTeam
