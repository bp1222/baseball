import {Team} from "@bp1222/stats-api"
import {Grid2} from "@mui/material"
import {useContext} from "react"

import {DefaultSeriesResultColor, GetSeriesColors} from "@/colors"
import {Game} from "@/components/Game.tsx"
import {AppStateContext} from "@/state/context.ts"
import {Series} from "@/types/Series.ts"
import {GetTeam} from "@/utils/GetTeam.ts"
import {GetGameResult} from "@/utils/Series/GetGameResult.ts"
import {GetSeriesResult} from "@/utils/Series/GetSeriesResult.ts"

import {ResultBadge} from "./SeriesItem/ResultBadge.tsx"
import {SeriesBadge} from "./SeriesItem/SeriesBadge.tsx"
import {SeriesTeams} from "./SeriesItem/SeriesTeams.tsx"

type SeriesItemProps = {
  series: Series

  // If we're interested in a specific team, we'll highlight the series with respect to them
  // If not, we will highlight scores based on the result
  interested?: Team
}

export const SeriesItem = ({series, interested}: SeriesItemProps) => {
  const {state} = useContext(AppStateContext)
  const seriesResult = GetSeriesResult(series, interested)
  const {background, border} = interested ? GetSeriesColors(series.type, seriesResult) : DefaultSeriesResultColor

  return (
    <Grid2 container
           maxWidth={"35em"}
           flexGrow={1}
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
               justifyContent={"flex-end"}>
          {series.games.map((g) => (
            <Game key={g.gamePk}
                  result={GetGameResult(g, interested)}
                  game={g}
                  home={GetTeam(state.teams, g.teams?.home?.team?.id)!}
                  away={GetTeam(state.teams, g.teams?.away?.team?.id)!}
                  interested={interested}/>
          ))}
        </Grid2>
      </Grid2>
    </Grid2>
  )
}
