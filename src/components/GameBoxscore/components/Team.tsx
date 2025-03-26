import {GameTeam} from "@bp1222/stats-api"
import {Grid2, Typography} from "@mui/material"

import {GetTeamImage} from "@/utils/GetTeamImage"

type BoxscoreTeamProps = {
  gameTeam: GameTeam
}

export const Team = ({ gameTeam }: BoxscoreTeamProps) => {
  return (
    <Grid2 container
           flexDirection={"column"}
           alignItems={"center"}
    >
      <Grid2 container
             flexDirection={"row"}
             alignItems={"center"}
      >
        {GetTeamImage(gameTeam.team.id)}
        <Typography
          paddingLeft={1}
          fontSize={"larger"}
        >
          {gameTeam.score}
        </Typography>
      </Grid2>
      <Grid2>
        <Typography fontSize={"small"}>
          {gameTeam.team.name}
        </Typography>
      </Grid2>
    </Grid2>
  )
}
