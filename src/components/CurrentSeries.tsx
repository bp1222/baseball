import {Box, CircularProgress, Grid} from "@mui/material"
import {AppStateContext} from "../state/Context.tsx"
import {useContext, useEffect, useState} from "react"
import {Series} from "../models/Series.ts"
import SeriesItem from "./series";

import dayJs from "../utils/dayjs.ts";

type CurrentSeriesProps = {
  selectedDate: dayJs.Dayjs
}

const CurrentSeries = ({selectedDate} : CurrentSeriesProps) => {
  const {state} = useContext(AppStateContext);
  const [currentSeries, setCurrentSeries] = useState<Series[] | null>([]);

  useEffect(() => {
    if (state.seasonSeries?.length??0 > 0) {
      setCurrentSeries(
        state.seasonSeries?.filter(
          (s) => selectedDate.isBetween(dayJs(s.startDate), dayJs(s.endDate), "day", "[]")
        ) ?? null
      )
    }
  }, [state.seasonSeries, selectedDate])

  if (currentSeries?.length == 0) {
    return (
      <Box display={"flex"} justifyContent={"center"} marginTop={2}>
        <CircularProgress/>
      </Box>
    );
  }

  if (currentSeries == null) {
    return (
      <Box display={"flex"} justifyContent={"center"}>
        No Games Today
      </Box>
    );
  } else {
    return (
      <Grid container flexWrap={"wrap"} columns={2}>
        <Grid container flexWrap={"wrap"} columns={2}>
          {currentSeries?.map((series) => (
            <Grid xs={1} padding={1} key={series.pk} item>
              <SeriesItem series={series} selectedDate={selectedDate}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
    )
  }
};

export default CurrentSeries