import {Box, CircularProgress, Grid} from "@mui/material"
import {AppStateContext} from "../state/Context.tsx"
import {useContext, useEffect, useState} from "react"
import {Series} from "../models/Series.ts"
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SeriesItem from "./series";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {useParams} from "react-router-dom";

import dayJs from "../utils/dayjs.ts";

export const Component = () => {
  const {state} = useContext(AppStateContext);

  const {seasonId} = useParams()

  const [selectedDate, setSelectedDate] = useState(dayJs());
  const [currentSeries, setCurrentSeries] = useState<Series[]|undefined>();

  const season = state.seasons?.find((s) => s.seasonId == seasonId)

  useEffect(() => {
    setCurrentSeries(
      state.seasonSeries?.filter(
        (s) => selectedDate.isBetween(dayJs(s.startDate), dayJs(s.endDate), "day", "[]")
      )
    )
  }, [state.seasonSeries, selectedDate])

  if (currentSeries == undefined) {
    return (
      <Box display={"flex"} justifyContent={"center"}>
        <CircularProgress/>
      </Box>
    );
  }

  const datePicker =
    <Box display={"flex"} justifyContent={"center"}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          views={["month", "day"]}
          defaultValue={dayJs(selectedDate)}
          minDate={dayJs(season?.regularSeasonStartDate).subtract(1, "day")}
          maxDate={dayJs(season?.postSeasonEndDate)}
          onChange={(date, context) => {
            if (context.validationError) return
            if (date) setSelectedDate(date)
          }}
        ></DatePicker>
      </LocalizationProvider>
    </Box>

  if (currentSeries.length == 0) {
    return (
      <>
        {datePicker}

        <Box display={"flex"} justifyContent={"center"}>
          No Games Today
        </Box>
      </>
    );
  }

  return (
    <>
      {datePicker}

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
