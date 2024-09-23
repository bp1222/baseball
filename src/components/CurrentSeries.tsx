import {Box, CircularProgress, Grid} from "@mui/material"
import {AppStateContext} from "../state/Context.tsx"
import {useContext, useEffect, useState} from "react"
import GenerateSeries, {Series} from "../models/Series.ts"
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SeriesItem from "./series";
import {LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {useParams} from "react-router-dom";

export const Component = () => {
  const {state} = useContext(AppStateContext);

  const {seasonId} = useParams()

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentSeries, setCurrentSeries] = useState<Series[]|undefined>();

  const season = state.seasons?.find((s) => s.seasonId == seasonId)

  useEffect(() => {
    const seenTeams: number[] = []
    const todaysGames = state.seasonSchedule?.dates.flatMap((d) => d.games).filter((g) => {
      const gameDate = new Date(g.gameDate)
      return gameDate.getFullYear() == selectedDate.getFullYear() && gameDate.getMonth() == selectedDate.getMonth() && gameDate.getDate() == selectedDate.getDate()
    }).filter((g) => {
      if (seenTeams.includes(g.teams.home.team.id)) return false
      seenTeams.push(g.teams.home.team.id)
      return true
    })

    const activeSeries = todaysGames?.map((game) => {
      return state.seasonSchedule?.dates.flatMap((d) => d.games).filter((g) => {
        return g.teams.home.team.id == game.teams.home.team.id && g.teams.home.seriesNumber == game.teams.home.seriesNumber
      })
    })

    const generatedSeries = activeSeries?.flatMap((series) => {
      if (series == undefined) return
      const team = state.teams?.find((t) => t.id == series[0].teams.home.team.id)
      return GenerateSeries(series, team!)
    }) as Series[]|undefined

    setCurrentSeries(generatedSeries)
  }, [state.seasonSchedule, selectedDate])

  if (currentSeries == undefined) {
    return (
      <Box display={"flex"} justifyContent={"center"}>
        <CircularProgress/>
      </Box>
    );
  }

  if (currentSeries.length == 0) {
    return (
      <Box display={"flex"} justifyContent={"center"}>
      </Box>
    );
  }

  return (
    <>
      <Box display={"flex"} justifyContent={"center"}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            defaultValue={dayjs(selectedDate)}
            minDate={dayjs(season?.seasonStartDate)}
            maxDate={dayjs(season?.postSeasonEndDate)}
            onChange={(date) => date?.toDate() ? setSelectedDate(date.toDate()) : null}
          ></DatePicker>
        </LocalizationProvider>
      </Box>

      <Grid container flexWrap={"wrap"} columns={2}>
        <Grid container flexWrap={"wrap"} columns={2}>
          {currentSeries?.map((series) => (
            <Grid xs={1} padding={1} key={series.pk} item>
              <SeriesItem series={series} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  )
};
