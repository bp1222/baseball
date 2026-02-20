import { Grid } from '@mui/material'

import { BoxscoreTeam } from '@/types/Boxscore'

import { BattersBoxscore } from './TeamBoxscore/BattersBoxscore'
import { PitchersBoxscore } from './TeamBoxscore/PitchersBoxscore'

type TeamBoxscoreProps = {
  boxscore: BoxscoreTeam
}

export const TeamBoxscore = ({ boxscore }: TeamBoxscoreProps) => {
  return (
    <Grid container rowSpacing={1.5}>
      <Grid size={12} sx={{ minWidth: 0 }}>
        <BattersBoxscore boxscore={boxscore} />
      </Grid>
      <Grid size={12} sx={{ minWidth: 0 }}>
        <PitchersBoxscore boxscore={boxscore} />
      </Grid>
    </Grid>
  )
}
