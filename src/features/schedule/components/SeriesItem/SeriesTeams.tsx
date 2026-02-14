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
      <Grid
        container
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        sx={{ minWidth: 0 }}
      >
        <Grid justifyItems="center" sx={{ minWidth: 0, flex: "1 1 0", maxWidth: "45%", paddingRight: 0.5 }}>
          <ShortTeam team={away} dead={isPlayoffs ? awayLoss : false} showAbbreviation={false} />
        </Grid>
        <Grid sx={{ flexShrink: 0 }}>
          <Typography fontSize="larger" fontWeight="bold">
            @
          </Typography>
        </Grid>
        <Grid sx={{ minWidth: 0, flex: "1 1 0", maxWidth: "45%", paddingLeft: 0.5 }}>
          <ShortTeam team={home} dead={isPlayoffs ? homeLoss : false} showAbbreviation={false} />
        </Grid>
      </Grid>
      {isPlayoffs && (
        <Grid>
          <Typography textAlign="center" fontSize="small" fontWeight={600}>
            {away && home
              ? `${GetSeriesWins(series, away)} – ${GetSeriesWins(series, home)}`
              : "–"}
          </Typography>
        </Grid>
      )}
    </Fragment>
  )
}
