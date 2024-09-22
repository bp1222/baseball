import { Box, Stack, Typography } from "@mui/material"
import { MLBTeam } from "@bp1222/stats-api"
import {Series, SeriesHomeAway} from "../../models/Series.ts"
import {FindTeam} from "../../utils/findTeam.ts";
import {AppStateContext} from "../../state/Context.tsx";
import {useContext} from "react";

type SeriesTeamProps = {
  series: Series
  interested?: MLBTeam
}

export const SeriesTeams = ({ series, interested }: SeriesTeamProps) => {
  const {state} = useContext(AppStateContext)
  const getImage = (id: number | undefined) =>
    "https://www.mlbstatic.com/team-logos/team-cap-on-light/" + id + ".svg"

  const getClubName = (name: string | undefined): string | undefined => {
    if (name == "Diamondbacks") {
      return "D-Backs"
    }
    return name
  }

  if (!interested) {
    return (
      <Stack direction={{xs: "column", sm: "row"}}>
        <Box paddingLeft={1} marginTop={0.5} alignContent={"center"}>
          <img src={getImage(series.games[0].game.teams.away.team.id)} height={24} width={24}/>
        </Box>
        <Box paddingLeft={1} alignContent={"center"}>
          <Typography fontSize={"larger"} fontWeight={"bold"} overflow={'visible'}>
            {series.homeaway == SeriesHomeAway.Split
              ? " against "
              : " @ "}
          </Typography>
        </Box>
        <Box paddingLeft={1} marginTop={0.5} alignContent={"center"}>
          <img src={getImage(series.games[0].game.teams.home.team.id)} height={24} width={24}/>
        </Box>
      </Stack>
    )
  } else {
    const against = FindTeam(state.teams, series.against?.team.id)
    return (
      <Stack direction={{xs: "column", sm: "row"}}>
        <Box paddingLeft={1} marginTop={0.5} alignContent={"center"}>
          <img src={getImage(against?.id)} height={24} width={24}/>
        </Box>
        <Box paddingLeft={{xs: 1, sm: 0}}>
          <Typography fontSize={"smaller"} overflow={'visible'}>
            {series.homeaway == SeriesHomeAway.Home
              ? "vs "
              : series.homeaway == SeriesHomeAway.Away
                ? "@ "
                : "against "}
            {against?.franchiseName}
          </Typography>
          <Typography
            noWrap
            overflow={'visible'}
            fontSize={{xs: "smaller", sm: "larger"}}
            fontStyle={"bold"}
            textOverflow={"clip"}
          >
            {getClubName(against?.clubName)?.toUpperCase()}
          </Typography>
        </Box>
      </Stack>
    )
  }
}
