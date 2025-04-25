import {Color, Grid} from "@mui/material"

import {useAppStateUtil} from "@/state"
import {DefaultGameResultColor} from "@/types/Game/GameResult.ts"
import {GameTeam} from "@/types/GameTeam.ts"

type GameScoreProps = {
  gameTeam: GameTeam
  color?: Color
}

export const GameScore = ({gameTeam, color}: GameScoreProps) => {
  const {getTeam} = useAppStateUtil()

  const scoreColor: Color = color || DefaultGameResultColor

  return (
    <Grid container
           fontSize={"x-small"}
           textAlign={"center"}>
      <Grid borderRight={1}
             borderBottom={1}
             borderColor={scoreColor[100]}
             bgcolor={scoreColor[50]}
             color={scoreColor[700]}
             width={"70%"}
             paddingTop={0.1}>
        {getTeam(gameTeam.teamId)?.abbreviation}
      </Grid>
      <Grid borderBottom={1}
             borderColor={scoreColor[100]}
             bgcolor={scoreColor[50]}
             color={scoreColor[700]}
             width={"30%"}
             paddingTop={0.1}>
        {gameTeam.score ?? "-"}
      </Grid>
    </Grid>
  )
}
