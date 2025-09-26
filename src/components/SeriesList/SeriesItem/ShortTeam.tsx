import {Grid, Tooltip, Typography} from "@mui/material"

import {Team} from "@/types/Team.ts"
import {GetTeamImage} from "@/utils/GetTeamImage.tsx"

type ShortTeamProps = {
  team?: Team
  dead?: boolean
}

const ShortTeam = ({team, dead}: ShortTeamProps) => {
  if (team == undefined) return
  const isTbd = /[\d/]/

  return (
    <Grid container
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
          {isTbd.test(team.abbreviation??'') ? 'TBD' : team.abbreviation?.toUpperCase() ?? "TBD"}
        </Typography>
      </Tooltip>
    </Grid>
  )
}

export default ShortTeam