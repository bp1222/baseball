import {Team} from "@bp1222/stats-api"
import {Grid2, Typography} from "@mui/material"
import {useContext} from "react"

import {
  GetSeriesHomeAway,
  GetSeriesResult, GetSeriesWins,
  Series,
  SeriesHomeAway,
  SeriesResult,
  SeriesType
} from "../../models/Series.ts"
import {AppStateContext} from "../../state/Context.tsx"
import {FindTeam} from "../../utils/FindTeam.ts"
import {GetTeamImage} from "../../utils/GetTeamImage.tsx"
import ShortTeam from "./ShortTeam.tsx"

type SeriesTeamProps = {
  series: Series
  interested?: Team
}

export const SeriesTeams = ({ series, interested }: SeriesTeamProps) => {
  const {state} = useContext(AppStateContext)
  const homeaway = GetSeriesHomeAway(series, interested)

  if (!interested) {
    const home = FindTeam(state.teams, series.games[0].teams.home.team.id) ?? series.games[0].teams.home.team
    const away = FindTeam(state.teams, series.games[0].teams.away.team.id) ?? series.games[0].teams.away.team

    const isPlayoffs = [SeriesType.WildCard, SeriesType.Division, SeriesType.League, SeriesType.World].indexOf(series.type) >= 0
    const homeLoss = [SeriesResult.Loss, SeriesResult.Swept].indexOf(GetSeriesResult(series, series.games[0].teams.home.team)) >= 0
    const awayLoss = [SeriesResult.Loss, SeriesResult.Swept].indexOf(GetSeriesResult(series, series.games[0].teams.away.team)) >= 0

    return (
      <>
        <Grid2 container
               flexDirection={"row"}
               alignItems={"center"}>
          <Grid2 paddingRight={1}>
            <ShortTeam team={away} dead={isPlayoffs ? awayLoss : false} />
          </Grid2>
          <Grid2>
            <Typography fontSize={"larger"}
                        fontWeight={"bold"}>
              @
            </Typography>
          </Grid2>
          <Grid2 paddingLeft={1}>
            <ShortTeam team={home} dead={isPlayoffs ? homeLoss : false} />
          </Grid2>
        </Grid2>
        {isPlayoffs ? <Grid2>
          <Typography textAlign={"center"}>
          {GetSeriesWins(series, away)} - {GetSeriesWins(series, home)}
          </Typography>
        </Grid2> : <></>}
      </>
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
             flexDirection={"column"}
             alignItems={"center"}>
        <Grid2 marginBottom={-.5}>
          {GetTeamImage(against?.id)}
        </Grid2>
        <Grid2>
          <Typography display={"inline"}
                      fontSize={"xx-small"}>
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
            fontSize={"smaller"}
            fontStyle={"bold"}>
            {(against?.clubName ?? against.name)?.toUpperCase()}
          </Typography>
        </Grid2>
      </Grid2>
    )
  }
}
