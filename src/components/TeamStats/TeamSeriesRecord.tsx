import {Alert, CircularProgress, Grid, Typography} from "@mui/material"

import {useSchedule} from "@/queries/schedule.ts"
import {GetSeriesResult} from "@/types/Series.ts"
import {SeriesResult} from "@/types/Series/SeriesResult.ts"
import {SeriesType} from "@/types/Series/SeriesType.ts"
import {Team} from "@/types/Team.ts"
import LabelPaper from "@/utils/LabelPaper.tsx"

type TeamSeriesRecordProps = {
  team: Team
}

export const TeamSeriesRecord = ({team}: TeamSeriesRecordProps) => {
  const { data: seasonSeries, isPending, isError } = useSchedule()

  const regularSeasonSeriesResults = seasonSeries
  ?.filter((s) => s.type == SeriesType.Regular)
  ?.filter((s) => s.games
    .some((g) => g.away.teamId == team?.id || g.home.teamId == team?.id)
  ).map((s) => GetSeriesResult(s, team))

  const seriesWins = regularSeasonSeriesResults?.filter((s) => s == SeriesResult.Win || s == SeriesResult.Sweep).length ?? 0
  const seriesLosses = regularSeasonSeriesResults?.filter((s) => s == SeriesResult.Loss || s == SeriesResult.Swept).length ?? 0
  const seriesTies = regularSeasonSeriesResults?.filter((s) => s == SeriesResult.Tie).length ?? 0

  const seriesPct = ((seriesWins + (.5 * seriesTies)) / (seriesWins + seriesLosses + seriesTies))

  if (isPending) {
    return <CircularProgress />
  } else if (isError) {
    return <Alert severity={'error'}>Unable to acquire series record</Alert>
  }

  return (
    <LabelPaper label={"Series Record"}>
      <Grid container
            display={"flex"}
            flexDirection={"column"}>
        <Grid container
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
              justifyItems={"center"}
              textAlign={"center"}
              columns={3}>
          <Grid size={1}>
            <Typography fontSize={"xx-large"}>{seriesWins}</Typography>
          </Grid>
          <Grid size={1}>
            <Typography fontSize={"xx-large"}>{seriesLosses}</Typography>
          </Grid>
          <Grid size={1}>
            <Typography fontSize={"xx-large"}>{seriesTies}</Typography>
          </Grid>
        </Grid>
        <Grid container
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
              justifyItems={"center"}
              textAlign={"center"}
              columns={3}>
          <Grid size={1}>
            <Typography fontSize={"smaller"}>{"Series Wins"}</Typography>
          </Grid>
          <Grid size={1}>
            <Typography fontSize={"smaller"}>{"Series Losses"}</Typography>
          </Grid>
          <Grid size={1}>
            <Typography fontSize={"smaller"}>{"Series Ties"}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"center"}
            justifyItems={"center"}
            textAlign={"center"}
            columns={1}>
        {isNaN(seriesPct) ? <></> :
          <Grid size={1} paddingBottom={1}>
            <Typography fontSize={"smaller"} display={"inline"}
                        fontWeight={"bold"}>{seriesPct === 1 ? seriesPct.toFixed(3) : seriesPct.toFixed(3).substring(1)}</Typography>
            <Typography fontSize={"smaller"} display={"inline"}> Series Winning Percentage</Typography>
          </Grid>
        }
      </Grid>
    </LabelPaper>
  )
}