import {Team} from "@bp1222/stats-api"
import {Grid2, Tooltip, Typography} from "@mui/material"

import {GetTeamImage} from "@/utils/GetTeamImage"

type ShortTeamProps = {
  team: Team | undefined
  dead?: boolean
}

const ShortTeam = ({team, dead}: ShortTeamProps) => {
  if (team == undefined) return

  return (
    <Grid2>
      <Grid2 container
             justifyContent={"center"}
             alignItems={"center"}
             flexDirection={"column"}>
        <Tooltip title={team.name}
                 enterDelay={500}
                 enterNextDelay={500}
                 leaveDelay={200}>
          <Typography
            width={"min-content"}
            fontSize={"smaller"}>
            {GetTeamImage(team, dead)}
            {team.abbreviation?.toUpperCase() ?? "TBD"}
          </Typography>
        </Tooltip>
      </Grid2>
    </Grid2>
  )
}

export default ShortTeam