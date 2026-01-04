import {Grid, Typography} from "@mui/material"
import {Fragment} from "react"

import {useTeams} from "@/queries/team.ts"
import {GetSeriesResult, GetSeriesWins, Series} from "@/types/Series.ts"
import {SeriesResult} from "@/types/Series/SeriesResult.ts"
import {SeriesType} from "@/types/Series/SeriesType.ts"

import ShortTeam from "./ShortTeam.tsx"

type SeriesTeamsProps = {
  series: Series
}

export const SeriesTeams = ({series}: SeriesTeamsProps) => {
  const { data: teams } = useTeams()
  const home = teams?.find((t) => t.id == series.games[0].home.teamId)
  const away = teams?.find((t) => t.id == series.games[0].away.teamId)

  const isPlayoffs = [SeriesType.WildCard, SeriesType.Division, SeriesType.League, SeriesType.World].indexOf(series.type) >= 0
  const homeLoss = [SeriesResult.Loss, SeriesResult.Swept].indexOf(GetSeriesResult(series, home)) >= 0
  const awayLoss = [SeriesResult.Loss, SeriesResult.Swept].indexOf(GetSeriesResult(series, away)) >= 0

  return (
    <Fragment>
      <Grid container
            flexDirection={"row"}
            justifyContent={"center"}
            alignItems={"center"}>
        <Grid justifyItems={"center"} width={"40%"} maxWidth={"40%"} paddingRight={1}>
          <ShortTeam team={away} dead={isPlayoffs ? awayLoss : false}/>
        </Grid>
        <Grid>
          <Typography fontSize={"larger"}
                      fontWeight={"bold"}>
            @
          </Typography>
        </Grid>
        <Grid width={"40%"} maxWidth={"40%"} paddingLeft={1}>
          <ShortTeam team={home} dead={isPlayoffs ? homeLoss : false}/>
        </Grid>
      </Grid>
      {isPlayoffs ? <Grid>
        <Typography textAlign={"center"}>
          {GetSeriesWins(series, away!)} - {GetSeriesWins(series, home!)}
        </Typography>
      </Grid> : <></>}
    </Fragment>
  )
}
