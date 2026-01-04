import {ChevronLeft, ChevronRight} from "@mui/icons-material"
import {Alert, Box, CircularProgress, Grid} from "@mui/material"
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import {useEffect, useState} from "react"

import {SeriesList} from "@/components/SeriesList.tsx"
import {useSchedule} from "@/queries/schedule.ts"
import {useSeason} from "@/queries/season.ts"
import {useTeams} from "@/queries/team.ts"
import {Series} from "@/types/Series.ts"
import {SeriesType} from "@/types/Series/SeriesType.ts"

type Props = {
  teams: ReturnType<typeof useTeams>["data"]
  season: ReturnType<typeof useSeason>["data"]
}

export const SeasonSeries = ({teams, season}: Props) => {
  const { data: seasonSeries, isPending, isError } = useSchedule()

  const [currentSeries, setCurrentSeries] = useState<Series[]|undefined>([])
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
        seasonSeries?.filter(
          (s) => selectedDate?.isBetween(dayjs(s.startDate), dayjs(s.endDate), "day", "[]")
        )
        .sort(
          (a, b) => {
            const aHome = teams?.find((t) => t.id == a.games[0].home.teamId)
            const bHome = teams?.find((t) => t.id == b.games[0].home.teamId)

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
          }
        )
      )
    }
  }, [teams, seasonSeries, selectedDate])

  if (isPending) {
    return (
      <Box width={'fit-content'}>
        <CircularProgress />
      </Box>
    )
  } else if (isError) {
    return (
      <Box width={'fit-content'}>
        <Alert severity={'error'}>Error Loading Schedule</Alert>
      </Box>
    )
  }

  return (
    <>
      <Grid container
            id={'datePicker'}
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
                        actionBar: {actions: ["today"]},
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

      {currentSeries?.length == 0 ? (
        <Box display={"flex"} justifyContent={"center"}>
          No Games on This Date
        </Box>
      ) : (
        <SeriesList series={currentSeries!} selectedDate={selectedDate}/>
      )}
    </>
  )
}