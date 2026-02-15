import {Grid} from "@mui/material"

import { BoxscoreTeam } from "@/types/Boxscore"

import { BattersBoxscore } from "./TeamBoxscore/BattersBoxscore"
import { PitchersBoxscore } from "./TeamBoxscore/PitchersBoxscore"

type TeamBoxscoreProps = {
  boxscore: BoxscoreTeam
}

export const TeamBoxscore = ({boxscore}: TeamBoxscoreProps) => {
  return (
    <Grid container
          rowSpacing={2}>
      <Grid flexGrow={1}>
        <BattersBoxscore boxscore={boxscore}/>
      </Grid>
      <Grid flexGrow={1}>
        <PitchersBoxscore boxscore={boxscore}/>
      </Grid>
    </Grid>
  )
}