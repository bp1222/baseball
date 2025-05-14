import {ChevronLeft, ChevronRight} from "@mui/icons-material"
import {Box, CircularProgress, Grid} from "@mui/material"
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {SeriesList} from "@/components/SeriesList.tsx"
import {useAppState, useAppStateUtil} from "@/state"
import {Series} from "@/types/Series.ts"
import {SeriesType} from "@/types/Series/SeriesType.ts"

export {CurrentDay as default}
const CurrentDay = () => {
  const {seasons, seasonSeries} = useAppState()
  const {getTeam} = useAppStateUtil()
  const {seasonId} = useParams()
  const season = seasons.find((s) => s.seasonId == seasonId)

  const [currentSeries, setCurrentSeries] = useState<Series[]>([])
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(
    dayjs().isBetween(dayjs(season?.regularSeasonStartDate), dayjs(season?.postSeasonEndDate)) ?
      dayjs() : (
        dayjs().isBefore(dayjs(season?.regularSeasonStartDate)) ?
          dayjs(season?.regularSeasonStartDate) :
          dayjs(season?.postSeasonEndDate ?? season?.seasonEndDate)
      )
  )

  useEffect(() => {
    if (seasonSeries?.length ?? 0 > 0) {
      setCurrentSeries(
        seasonSeries
        .filter((s) => selectedDate?.isBetween(dayjs(s.startDate), dayjs(s.endDate), "day", "[]"))
        .sort((a, b) => {
          const aHome = getTeam(a.games[0].home.teamId)
          const bHome = getTeam(b.games[0].home.teamId)

          if ([
            SeriesType.WildCard,
            SeriesType.Division,
            SeriesType.League,
            SeriesType.World].indexOf(a.type) >= 0) {
            if (aHome?.league && bHome?.league) {
              return aHome.league < bHome.league ? -1 : 1
            }
          }

          if (!selectedDate?.isBefore(dayjs(), 'day')) {
            const aGame = a.games.find(
              (g) => selectedDate?.isSame(dayjs(g.gameDate), "day")
            )
            const bGame = b.games.find(
              (g) => selectedDate?.isSame(dayjs(g.gameDate), "day")
            )

            if (aGame && bGame) {
              if (aGame.gameDate < bGame.gameDate) {
                return -1
              }
              if (aGame.gameDate > bGame.gameDate) {
                return 1
              }
            }
          }

          return aHome?.name.localeCompare(bHome?.name ?? "") ?? 0
        })
      )
    }
  }, [getTeam, seasonSeries, selectedDate])

  return (
    <Grid container
          flexDirection={"column"}>

      <Grid container
            flexDirection={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            paddingTop={2}
            paddingBottom={2}>
        <ChevronLeft fontSize={"large"} onClick={
          () => setSelectedDate(selectedDate?.subtract(1, "day"))
        }/>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Select Date"
                      views={["month", "day"]}
                      value={selectedDate}
                      minDate={dayjs(season?.seasonStartDate)}
                      maxDate={dayjs(season?.postSeasonEndDate)}
                      slotProps={{
                        actionBar: { actions: ["today"] },
                      }}
                      onChange={(date, context) => {
                        if (!context.validationError && date) {
                          setSelectedDate(date)
                        }
                      }}/>
        </LocalizationProvider>
        <ChevronRight fontSize={"large"} onClick={
          () => setSelectedDate(selectedDate?.add(1, "day"))
        }/>
      </Grid>

      <Grid>
        {!currentSeries ? <CircularProgress/> :
          currentSeries.length == 0 ? (
            <Box display={"flex"} justifyContent={"center"}>
              No Games on This Date
            </Box>
          ) : (
            <SeriesList series={currentSeries} selectedDate={selectedDate}/>
          )}
      </Grid>
    </Grid>
  )
}
