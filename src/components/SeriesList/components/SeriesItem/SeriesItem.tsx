import {Team} from "@bp1222/stats-api"
import {Grid2} from "@mui/material"
import {useContext} from "react"

import {DefaultSeriesResultColor, GetSeriesColors} from "@/colors"
import {Game} from "@/components/Game"
import {AppStateContext} from "@/state"
import {GetSeriesGameResult, GetSeriesResult, Series} from "@/types/Series.ts"
import dayjs from "@/utils/dayjs.ts"
import {GetTeam} from "@/utils/GetTeam.ts"

import {ResultBadge} from "./components/ResultBadge"
import {SeriesBadge} from "./components/SeriesBadge"
import {SeriesTeams} from "./components/SeriesTeams"

type SeriesItemProps = {
  series: Series

  // If we're interested in a specific team, we'll highlight the series with respect to them
  // If not, we will highlight scores based on the result
  interested?: Team

  // For outlining a day
  selectedDate?: dayjs.Dayjs
}

export const SeriesItem = ({series, interested, selectedDate}: SeriesItemProps) => {
  const {state} = useContext(AppStateContext)
  const seriesResult = GetSeriesResult(series, interested)
  const {background, border} = interested ? GetSeriesColors(series.type, seriesResult) : DefaultSeriesResultColor

  return (
    <Grid2 container
           id={series.pk}
           maxWidth={400}
           flexGrow={1}
           flexDirection={"row"}
           flexWrap={"nowrap"}
           border={1}
           borderRadius={1}
           borderColor={border}
           bgcolor={background}
           fontSize={"small"}
           columns={3}>

      {interested ? (
        <Grid2 position={"absolute"}
               marginTop={-1}
               marginLeft={-1}>
          <ResultBadge result={seriesResult} type={series.type}/>
        </Grid2>
      ) : ''}

      <Grid2 alignContent={"center"}
             minWidth={120}
             maxWidth={120}>
        <Grid2 container
               paddingTop={1}
               paddingBottom={1}
               justifyContent={"center"}
        >
          <Grid2>
            <SeriesTeams series={series}
                         interested={interested}/>
          </Grid2>
          <Grid2>
            <SeriesBadge type={series.type}/>
          </Grid2>
        </Grid2>
      </Grid2>

      <Grid2 flexGrow={1}
             justifyContent={"flex-end"}
             alignContent={"center"}>
        <Grid2 container
               justifyContent={"flex-end"}
        >
          {series.games.map((g) => (
            <Game key={g.gamePk}
                      result={GetSeriesGameResult(g, interested)}
                      game={g}
                      home={GetTeam(state.teams, g.teams?.home?.team?.id)!}
                      away={GetTeam(state.teams, g.teams?.away?.team?.id)!}
                      interested={interested}
                      selectedDate={selectedDate}/>
          ))}
        </Grid2>
      </Grid2>
    </Grid2>
  )
}
