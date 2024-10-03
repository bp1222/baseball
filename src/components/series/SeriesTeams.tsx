import {Grid2, Typography} from "@mui/material"
import { Team } from "@bp1222/stats-api"
import {GetSeriesHomeAway, Series, SeriesHomeAway, SeriesType} from "../../models/Series.ts"
import {FindTeam} from "../../utils/findTeam.ts";
import {AppStateContext} from "../../state/Context.tsx";
import {useContext} from "react";

type SeriesTeamProps = {
  series: Series
  interested?: Team
}

export const SeriesTeams = ({ series, interested }: SeriesTeamProps) => {
  const {state} = useContext(AppStateContext)
  const homeaway = GetSeriesHomeAway(series, interested)

  const getClubName = (name: string | undefined): string | undefined => {
    if (name == "Diamondbacks") {
      return "D-Backs"
    }
    return name
  }

  const getImage = (id: number | undefined) => <img
    src = {"https://www.mlbstatic.com/team-logos/team-cap-on-light/" +id + ".svg"}
    height = {24}
    width = {24}
  />

  if (!interested) {
    let home = FindTeam(state.teams, series.games[0].teams.home.team.id)
    let away = FindTeam(state.teams, series.games[0].teams.away.team.id)

    if (home == undefined) {
      home = series.games[0].teams.home.team
    }
    if (away == undefined) {
      away = series.games[0].teams.away.team
    }

    return (
      <Grid2 container
             display={"flex"}
             flexDirection={"row"}
             minWidth={120}
             maxWidth={120}
             paddingLeft={1}
             paddingRight={3}
             paddingTop={.5}
             paddingBottom={.5}
             justifyContent={"center"}
             justifyItems={"center"}
             alignItems={"center"}
             alignContent={"center"}>
        <Grid2 paddingRight={1}>
          <Grid2 container
                 justifyContent={"center"}
                 alignItems={"center"}
                 flexDirection={"column"}>
            {getImage(series.games[0].teams.away.team.id)}
            <Typography
              width={"min-content"}
              fontSize={"smaller"}>
              {getClubName(away?.abbreviation)?.toUpperCase()}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2>
          <Typography fontSize={"larger"}
                      fontWeight={"bold"}>
            @
          </Typography>
        </Grid2>
        <Grid2 paddingLeft={1}>
          <Grid2 container
                 justifyContent={"center"}
                 alignItems={"center"}
                 flexDirection={"column"}>
            {getImage(series.games[0].teams.home.team.id)}
            <Typography
              textAlign={"center"}
              fontSize={"smaller"}>
              {getClubName(home?.abbreviation)?.toUpperCase()}
            </Typography>
          </Grid2>
        </Grid2>
      </Grid2>
    )
  } else {
    let against: Team | undefined

    if (series.games[0].teams.away.team.id != interested.id) {
      against = FindTeam(state.teams, series.games[0].teams.away.team.id)
      if (against == undefined) {
        against = series.games[0].teams.away.team
      }
    } else {
      against = FindTeam(state.teams, series.games[0].teams.home.team.id)
      if (against == undefined) {
        against = series.games[0].teams.home.team
      }
    }

    return (
      <Grid2 container
             display={"flex"}
             flexDirection={"column"}

             minWidth={120}
             maxWidth={120}

             paddingLeft={1}
             paddingRight={3}
             paddingTop={.5}
             paddingBottom={.5}

             textAlign={"center"}

             justifyContent={"center"}
             justifyItems={"center"}
             alignItems={"center"}
             alignContent={"center"}>
        <Grid2 marginBottom={-.5}>
          {getImage(against?.id)}
        </Grid2>
        <Grid2>
          <Typography display={"inline"}
                      fontSize={"xx-small"}
                      overflow={"visible"}>
            {homeaway == SeriesHomeAway.Home
              ? "vs "
              : homeaway == SeriesHomeAway.Away
                ? "@ "
                : [SeriesType.WildCard, SeriesType.Division, SeriesType.League, SeriesType.World].indexOf(series.type) > 0
                  ? (series.games[0].teams.away.team.id == interested.id ? "@ ": "vs ") : "against "}
          </Typography>
          <Typography display={"inline"}
                      fontSize={"x-small"}
                      noWrap>
            {against?.franchiseName}
          </Typography>
        </Grid2>
        <Grid2>
          <Typography
            overflow={"visible"}
            fontSize={"smaller"}
            fontStyle={"bold"}>
            {getClubName(against?.clubName ?? against.name)?.toUpperCase()}
          </Typography>
        </Grid2>
      </Grid2>
    )
  }
}
