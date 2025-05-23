import {Grid} from "@mui/material"

import {BattersBoxscore} from "@/components/GameBoxscore/TeamsBoxscore/TeamBoxscore/BattersBoxscore.tsx"
import {PitchersBoxscore} from "@/components/GameBoxscore/TeamsBoxscore/TeamBoxscore/PitchersBoxscore.tsx"
import {BoxscoreTeam} from "@/types/Boxscore.ts"

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