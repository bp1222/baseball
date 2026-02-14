import {Grid, Tooltip, Typography} from "@mui/material"

import {Team} from "@/types/Team.ts"
import { GetTeamImage } from "@/shared/components/GetTeamImage"

type ShortTeamProps = {
  team?: Team
  dead?: boolean
  /** When false, only show logo (e.g. in non-team series view). Default true. */
  showAbbreviation?: boolean
}

const ShortTeam = ({ team, dead, showAbbreviation = true }: ShortTeamProps) => {
  if (team == undefined) return
  const isTbd = /[\d/]/

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{ minWidth: 0 }}
    >
      <Tooltip title={team.name} enterDelay={500} enterNextDelay={500} leaveDelay={200}>
        <Typography fontSize="smaller" noWrap sx={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
          {GetTeamImage(team, dead)}
          {showAbbreviation && (isTbd.test(team.abbreviation ?? "") ? "TBD" : team.abbreviation?.toUpperCase() ?? "TBD")}
        </Typography>
      </Tooltip>
    </Grid>
  )
}

export default ShortTeam