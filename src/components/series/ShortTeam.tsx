import {Grid2, Typography} from "@mui/material";
import {GetTeamImage} from "../../utils/getTeamImage.tsx";
import {Team} from "@bp1222/stats-api";

type ShortTeamProps = {
  team: Team
}

const ShortTeam = ({team} : ShortTeamProps) => {
  return (
    <Grid2>
      <Grid2 container
             justifyContent={"center"}
             alignItems={"center"}
             flexDirection={"column"}>
        {GetTeamImage(team.id)}
        <Typography
          width={"min-content"}
          fontSize={"smaller"}>
          {team.abbreviation?.toUpperCase() ?? "TBD"}
        </Typography>
      </Grid2>
    </Grid2>
  )
}

export default ShortTeam;