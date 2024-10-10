import {Team} from "@bp1222/stats-api"
import {Grid2, Typography} from "@mui/material"

import {GetTeamImage} from "../../utils/GetTeamImage.tsx"

type ShortTeamProps = {
  team: Team | undefined
  dead?: boolean
}

const ShortTeam = ({team, dead} : ShortTeamProps) => {
  if (team == undefined) return

  return (
    <Grid2>
      <Grid2 container
             justifyContent={"center"}
             alignItems={"center"}
             flexDirection={"column"}>
        {GetTeamImage(team.id, dead)}
        <Typography
          width={"min-content"}
          fontSize={"smaller"}>
          {team.abbreviation?.toUpperCase() ?? "TBD"}
        </Typography>
      </Grid2>
    </Grid2>
  )
}

export default ShortTeam