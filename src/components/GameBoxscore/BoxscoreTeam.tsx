import {Grid, Typography} from "@mui/material"

import {useAppStateUtil} from "@/state"
import {GameTeam} from "@/types/GameTeam.ts"
import {GetTeamImage} from "@/utils/GetTeamImage.tsx"

type BoxscoreTeamProps = {
  gameTeam: GameTeam
}

export const BoxscoreTeam = ({gameTeam}: BoxscoreTeamProps) => {
  const {getTeam} = useAppStateUtil()
  return (
    <Grid container
           flexDirection={"column"}
           alignItems={"center"}
           textAlign={"center"}>
      <Grid container
             flexDirection={"row"}
             alignItems={"center"}>
        {GetTeamImage(getTeam(gameTeam.teamId)!)}
        <Typography
          paddingLeft={1}
          fontSize={"larger"}>
          {gameTeam.score}
        </Typography>
      </Grid>
      <Grid>
        <Typography fontSize={"small"}>
          {getTeam(gameTeam.teamId)?.name}
        </Typography>
        <Typography fontSize={"x-small"}>
          {gameTeam.record.wins} - {gameTeam.record.losses}
        </Typography>
      </Grid>
    </Grid>
  )
}
