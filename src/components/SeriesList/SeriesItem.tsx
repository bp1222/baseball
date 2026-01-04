import {Grid} from "@mui/material"
import {useParams} from "@tanstack/react-router"
import dayjs from "dayjs"

import {GameItem} from "@/components/GameItem.tsx"
import {SeriesTeam} from "@/components/SeriesList/SeriesItem/SeriesTeam.tsx"
import {useTeam} from "@/queries/team.ts"
import {GetSeriesResult, Series} from "@/types/Series.ts"
import {DefaultSeriesResultColor, GetSeriesColors} from "@/types/Series/SeriesResult.ts"

import {ResultBadge} from "./SeriesItem/ResultBadge.tsx"
import {SeriesBadge} from "./SeriesItem/SeriesBadge.tsx"
import {SeriesTeams} from "./SeriesItem/SeriesTeams.tsx"

type SeriesItemProps = {
  series: Series
  selectedDate?: dayjs.Dayjs
}

export const SeriesItem = ({series, selectedDate}: SeriesItemProps) => {
  const { teamId } = useParams({strict: false})
  const { data: interestedTeam } = useTeam(teamId)

  const seriesResult = GetSeriesResult(series, interestedTeam)
  const {
    background,
    border
  } = interestedTeam ? GetSeriesColors(series.type, seriesResult) : DefaultSeriesResultColor

  return (
    <Grid container
          maxWidth={"35em"}
          flexGrow={1}
          flexWrap={"nowrap"}
          border={1}
          borderRadius={1}
          borderColor={border}
          bgcolor={background}
          fontSize={"small"}
          columns={3}>

      {interestedTeam && (
        <Grid position={"absolute"}
              marginTop={-1}
              marginLeft={-1}>
          <ResultBadge result={seriesResult} type={series.type}/>
        </Grid>
      )}

      <Grid alignContent={"center"}
            minWidth={120}
            maxWidth={120}>
        <Grid container
              paddingTop={1}
              paddingBottom={1}
              justifyContent={"center"}>
          <Grid>
            {interestedTeam ? (
              <SeriesTeam series={series} team={interestedTeam}/>
            ) : (
              <SeriesTeams series={series}/>
            )}
          </Grid>
          <Grid>
            <SeriesBadge type={series.type}/>
          </Grid>
        </Grid>
      </Grid>

      <Grid flexGrow={1}
            justifyContent={"flex-end"}
            alignContent={"center"}>
        <Grid container
              justifyContent={"flex-end"}>
          {series.games.map((g) => (
            <GameItem key={g.pk}
                      game={g}
                      selectedDate={selectedDate}/>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}
