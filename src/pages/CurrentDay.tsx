import {ChevronLeft, ChevronRight} from "@mui/icons-material"
import {Box, CircularProgress, Grid2} from "@mui/material"
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {useContext, useEffect, useLayoutEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {SeriesList} from "@/components/SeriesList.tsx"
import {AppStateAction} from "@/state/actions.ts"
import {AppStateContext} from "@/state/context.ts"
import {Series} from "@/types/Series.ts"
import {SeriesType} from "@/types/Series/SeriesType.ts"
import dayJs from "@/utils/dayjs.ts"

export {CurrentDay as default}
const CurrentDay = () => {
  const {state, dispatch} = useContext(AppStateContext)
  const {seasonId} = useParams()
  const [currentSeries, setCurrentSeries] = useState<Series[] | null>(null)
  const season = state.seasons?.find((s) => s.seasonId == seasonId)

  useLayoutEffect(() => {
    if (dayJs().isBetween(dayJs(season?.regularSeasonStartDate), dayJs(season?.postSeasonEndDate))) {
      dispatch({
        type: AppStateAction.SelectedDate,
        selectedDate: dayJs()
      })
    } else {
      if (dayJs().isBefore(dayJs(season?.regularSeasonStartDate))) {
        dispatch({
          type: AppStateAction.SelectedDate,
          selectedDate: dayJs(season?.regularSeasonStartDate)
        })
      } else {
        dispatch({
          type: AppStateAction.SelectedDate,
          selectedDate: dayJs(season?.postSeasonEndDate ?? season?.seasonEndDate)
        })
      }
    }
  }, [dispatch, season])

  useEffect(() => {
    if (state.seasonSeries?.length ?? 0 > 0) {
      setCurrentSeries(
        state.seasonSeries
        ?.filter((s) => state.selectedDate?.isBetween(dayJs(s.startDate), dayJs(s.endDate), "day", "[]"))
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

          if (!state.selectedDate?.isBefore(dayJs(), 'day')) {
            const aGame = a.games.find(
              (g) => state.selectedDate?.format("YYYY-MM-DD") == dayJs(g.gameDate).format("YYYY-MM-DD")
            )
            const bGame = b.games.find(
              (g) => state.selectedDate?.format("YYYY-MM-DD") == dayJs(g.gameDate).format("YYYY-MM-DD")
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

          return a.games[0].teams.home.team.name.localeCompare(b.games[0].teams.home.team.name)
        }) ?? []
      )
    }
  }, [state.seasonSeries, state.selectedDate])

  return (
    <Grid2 container
           flexDirection={"column"}>

      <Grid2 container
             flexDirection={"row"}
             justifyContent={"center"}
             alignItems={"center"}
             paddingTop={2}
             paddingBottom={2}>
        <ChevronLeft fontSize={"large"} onClick={() => dispatch({
          type: AppStateAction.SelectedDate,
          selectedDate: state.selectedDate?.subtract(1, "day")
        })}/>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Select Date"
                      views={["month", "day"]}
                      value={state.selectedDate}
                      minDate={dayJs(season?.seasonStartDate)}
                      maxDate={dayJs(season?.postSeasonEndDate)}
                      onChange={(date, context) => {
                        if (context.validationError) return
                        if (date) dispatch({
                          type: AppStateAction.SelectedDate,
                          selectedDate: date
                        })
                      }}/>
        </LocalizationProvider>
        <ChevronRight fontSize={"large"} onClick={() => dispatch({
          type: AppStateAction.SelectedDate,
          selectedDate: state.selectedDate?.add(1, "day")
        })}/>
      </Grid2>

      <Grid2>
        {!currentSeries ? <CircularProgress/> :
          currentSeries.length == 0 ? (
            <Box display={"flex"} justifyContent={"center"}>
              No Games on This Date
            </Box>
          ) : (
            <SeriesList series={currentSeries}/>
          )}
      </Grid2>
    </Grid2>
  )
}
