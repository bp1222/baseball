import {Color, Grid} from "@mui/material"

import {useTeam} from "@/queries/team.ts"
import {DefaultGameResultColor} from "@/types/Game/GameResult.ts"
import {GameTeam} from "@/types/GameTeam.ts"

type GameScoreProps = {
  gameTeam: GameTeam
  color?: Color
}

export const GameScore = ({gameTeam, color}: GameScoreProps) => {
  const isTbd = /[\d/]/
  const { data: team } = useTeam(gameTeam.teamId)

  const scoreColor: Color = color || DefaultGameResultColor

  return (
    <Grid container textAlign="center" sx={{ fontSize: "0.75rem", minWidth: 0 }}>
      <Grid
        borderRight={1}
        borderBottom={1}
        borderColor={scoreColor[100]}
        bgcolor={scoreColor[50]}
        color={scoreColor[700]}
        sx={{ width: "70%", minWidth: 0, paddingTop: 0.1 }}
      >
        {isTbd.test(team?.abbreviation ?? "") ? "TBD" : team?.abbreviation}
      </Grid>
      <Grid
        borderBottom={1}
        borderColor={scoreColor[100]}
        bgcolor={scoreColor[50]}
        color={scoreColor[700]}
        sx={{ width: "30%", minWidth: 0, paddingTop: 0.1 }}
      >
        {gameTeam.score ?? "-"}
      </Grid>
    </Grid>
  )
}
