import {Team} from "@bp1222/stats-api"
import {Grid2, Typography} from "@mui/material"
import {useContext} from "react"

import {AppStateContext} from "@/state/context.ts"
import {SeriesResult} from "@/types/Series/SeriesResult.ts"
import {SeriesType} from "@/types/Series/SeriesType.ts"
import LabelPaper from "@/utils/LabelPaper.tsx"
import {GetSeriesResult} from "@/utils/Series/GetSeriesResult.ts"

type TeamSeriesRecordProps = {
  team: Team
}

export const TeamSeriesRecord = ({team}: TeamSeriesRecordProps) => {
  const {state} = useContext(AppStateContext)

  const regularSeasonSeriesResults = state.seasonSeries
  ?.filter((s) => s.type == SeriesType.Regular)
  ?.filter((s) => s.games
    .some((g) => g.teams.away.team.id == team?.id || g.teams.home.team.id == team?.id)
  ).map((s) => GetSeriesResult(s, team))

  const seriesWins = regularSeasonSeriesResults?.filter((s) => s == SeriesResult.Win || s == SeriesResult.Sweep).length ?? 0
  const seriesLosses = regularSeasonSeriesResults?.filter((s) => s == SeriesResult.Loss || s == SeriesResult.Swept).length ?? 0
  const seriesTies = regularSeasonSeriesResults?.filter((s) => s == SeriesResult.Tie).length ?? 0

  const seriesPct = ((seriesWins + (.5 * seriesTies)) / (seriesWins + seriesLosses + seriesTies))
  return (
    <LabelPaper label={"Series Record"}>
      <Grid2 container
             display={"flex"}
             flexDirection={"column"}>
        <Grid2 container
               display={"flex"}
               flexDirection={"row"}
               justifyContent={"center"}
               justifyItems={"center"}
               textAlign={"center"}
               columns={3}>
          <Grid2 size={1}>
            <Typography fontSize={"xx-large"}>{seriesWins}</Typography>
          </Grid2>
          <Grid2 size={1}>
            <Typography fontSize={"xx-large"}>{seriesLosses}</Typography>
          </Grid2>
          <Grid2 size={1}>
            <Typography fontSize={"xx-large"}>{seriesTies}</Typography>
          </Grid2>
        </Grid2>
        <Grid2 container
               display={"flex"}
               flexDirection={"row"}
               justifyContent={"center"}
               justifyItems={"center"}
               textAlign={"center"}
               columns={3}>
          <Grid2 size={1}>
            <Typography fontSize={"smaller"}>{"Series Wins"}</Typography>
          </Grid2>
          <Grid2 size={1}>
            <Typography fontSize={"smaller"}>{"Series Losses"}</Typography>
          </Grid2>
          <Grid2 size={1}>
            <Typography fontSize={"smaller"}>{"Series Ties"}</Typography>
          </Grid2>
        </Grid2>
      </Grid2>
      <Grid2 container
             display={"flex"}
             flexDirection={"row"}
             justifyContent={"center"}
             justifyItems={"center"}
             textAlign={"center"}
             columns={1}>
        {isNaN(seriesPct) ? <></> :
          <Grid2 size={1} paddingBottom={1}>
            <Typography fontSize={"smaller"} display={"inline"}
                        fontWeight={"bold"}>{seriesPct === 1 ? seriesPct.toFixed(3) : seriesPct.toFixed(3).substring(1)}</Typography>
            <Typography fontSize={"smaller"} display={"inline"}> Series Winning Percentage</Typography>
          </Grid2>
        }
      </Grid2>
    </LabelPaper>
  )
}