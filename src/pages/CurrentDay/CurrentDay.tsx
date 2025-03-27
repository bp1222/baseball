import {ChevronLeft, ChevronRight} from "@mui/icons-material"
import {Box, CircularProgress, Grid2} from "@mui/material"
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {useContext, useEffect, useLayoutEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {SeriesList} from "@/components/SeriesList"
import {AppStateContext} from "@/state"
import {Series, SeriesType} from "@/types/Series"
import dayJs from "@/utils/dayjs.ts"

export const CurrentDay = () => {
  const {state} = useContext(AppStateContext)
  const {seasonId} = useParams()
  const [selectedDate, setSelectedDate] = useState(dayJs())
  const [currentSeries, setCurrentSeries] = useState<Series[] | null>(null)
  const season = state.seasons?.find((s) => s.seasonId == seasonId)

  useLayoutEffect(() => {
    if (dayJs().isBetween(dayJs(season?.regularSeasonStartDate), dayJs(season?.postSeasonEndDate))) {
      setSelectedDate(dayJs())
    } else {
      if (dayJs().isBefore(dayJs(season?.regularSeasonStartDate))) {
        setSelectedDate(dayJs(season?.regularSeasonStartDate))
      } else {
        setSelectedDate(dayJs(season?.postSeasonEndDate ?? season?.seasonEndDate))
      }
    }
  }, [season])

  useEffect(() => {
    if (state.seasonSeries?.length ?? 0 > 0) {
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

  return (
    <Grid2 container
           flexDirection={"column"}>

      <Grid2 container
             flexDirection={"row"}
             justifyContent={"center"}
             alignItems={"center"}
             paddingTop={2}
             paddingBottom={2}>
        <ChevronLeft fontSize={"large"} onClick={() => setSelectedDate(selectedDate.subtract(1, "day"))}/>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Select Date"
                      views={["month", "day"]}
                      value={selectedDate}
                      minDate={dayJs(season?.seasonStartDate)}
                      maxDate={dayJs(season?.postSeasonEndDate)}
                      onChange={(date, context) => {
                        if (context.validationError) return
                        if (date) setSelectedDate(date)
                      }}/>
        </LocalizationProvider>
        <ChevronRight fontSize={"large"} onClick={() => setSelectedDate(selectedDate.add(1, "day"))}/>
      </Grid2>

      <Grid2>
        {currentSeries.length == 0 ? (
          <Box display={"flex"} justifyContent={"center"}>
            No Games on This Date
          </Box>
        ) : (
          <SeriesList series={currentSeries} selectedDate={selectedDate}/>
        )}
      </Grid2>
    </Grid2>
  )
}
