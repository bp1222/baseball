import {Box, CircularProgress} from "@mui/material"
import {useContext, useEffect, useState} from "react"

import {Series, SeriesType} from "../models/Series.ts"
import {AppStateContext} from "../state/Context.tsx"
import dayJs from "../utils/dayjs.ts"
import SeriesList from "./series/SeriesList.tsx"

type CurrentSeriesProps = {
  selectedDate: dayJs.Dayjs
}

const CurrentSeries = ({selectedDate} : CurrentSeriesProps) => {
  const {state} = useContext(AppStateContext)
  const [currentSeries, setCurrentSeries] = useState<Series[] | null>(null)

  useEffect(() => {
    if (state.seasonSeries?.length??0 > 0) {
      setCurrentSeries(
        state.seasonSeries
          ?.filter((s) => selectedDate.isBetween(dayJs(s.startDate), dayJs(s.endDate), "day", "[]"))
          .sort((a, b) => {
            if ([
              SeriesType.WildCard,
              SeriesType.Division,
              SeriesType.League,
              SeriesType.World].indexOf(a.type) >= 0) {
              if (a.games[0].teams.home.team.league?.id && b.games[0].teams.home.team.league?.id) {
                return a.games[0].teams.home.team.league?.id < b?.games[0]?.teams?.home?.team?.league?.id ? -1 : 1
              }
            }
            return a.games[0].teams.home.team.name.localeCompare(b.games[0].teams.home.team.name)
          }) ?? []
      )
    }
  }, [state.seasonSeries, selectedDate])

  if (currentSeries == null) {
    return (
      <Box display={"flex"} justifyContent={"center"} marginTop={2}>
        <CircularProgress/>
      </Box>
    )
  }

  if (currentSeries.length == 0) {
    return (
      <Box display={"flex"} justifyContent={"center"}>
        No Games on This Date
      </Box>
    )
  } else {
    return (
      <SeriesList series={currentSeries} selectedDate={selectedDate}/>
    )
  }
}

export default CurrentSeries