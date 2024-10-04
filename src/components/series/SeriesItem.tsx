import { Team } from "@bp1222/stats-api"
import { Grid2} from "@mui/material"
import { useContext } from "react"

import {
  GetSeriesGameResult,
  GetSeriesResult,
  Series,
} from "../../models/Series.ts"
import { AppStateContext } from "../../state/Context.tsx"
import dayjs from "../../utils/dayjs.ts"
import {FindTeam} from "../../utils/FindTeam.ts"
import {DefaultSeriesResultColor, GetSeriesColors} from "./colors.ts"
import {ResultBadge} from "./ResultBadge.tsx"
import {SeriesBadge} from "./SeriesBadge.tsx"
import {SeriesGame} from "./SeriesGame.tsx"
import {SeriesTeams} from "./SeriesTeams.tsx"

type SeriesItemProps = {
  series: Series

  // If we're interested in a specific team, we'll highlight the series with respect to them
  // If not, we will highlight scores based on the result
  interested?: Team

  // For outlining a day
  selectedDate?: dayjs.Dayjs
}

const SeriesItem = ({ series, interested, selectedDate }: SeriesItemProps) => {
  const { state } = useContext(AppStateContext)
  const seriesResult = GetSeriesResult(series, interested)
  const {background, border} = interested ? GetSeriesColors(series.type, seriesResult) : DefaultSeriesResultColor

  return (
    <Grid2 container
           id={"series-item-"+series.pk}
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
          <ResultBadge result={seriesResult} type={series.type} />
        </Grid2>
      ) : ''}

      <Grid2 size={1} alignContent={"center"}>
        <Grid2 container
               id={"series-item-teams"+series.pk}
               minWidth={120}
               maxWidth={120}
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

      <Grid2 size={2} justifyContent={"flex-end"} alignContent={"center"}>
        <Grid2 container
               id={"series-game-pre-"+series.pk}
               justifyContent={"flex-end"}
               >
          {series.games.map((g) => (
            <SeriesGame key={g.gamePk}
                        result={GetSeriesGameResult(g, interested)}
                        game={g}
                        home={FindTeam(state.teams, g.teams?.home?.team?.id)!}
                        away={FindTeam(state.teams, g.teams?.away?.team?.id)!}
                        interested={interested}
                        selectedDate={selectedDate}/>
          ))}
        </Grid2>
      </Grid2>
    </Grid2>
  )
}
export default SeriesItem
