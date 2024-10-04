import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { Grid2} from "@mui/material"
import {LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"
import { useContext, useEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {AppStateContext} from "../state/Context.tsx"
import dayJs from "../utils/dayjs.ts"
import CurrentSeries from "./CurrentSeries.tsx"

export const Component = () => {
  const {state} = useContext(AppStateContext)
  const {seasonId} = useParams()
  const [selectedDate, setSelectedDate] = useState(dayJs())
  const season = state.seasons?.find((s) => s.seasonId == seasonId)

  useEffect(() => {
    if (dayJs().isBetween(dayJs(season?.regularSeasonStartDate), dayJs(season?.postSeasonEndDate))) {
      setSelectedDate(dayJs())
    } else {
      if (dayJs().isBefore(dayJs(season?.regularSeasonStartDate))) {
        setSelectedDate(dayJs(season?.regularSeasonStartDate))
      } else {
        setSelectedDate(dayJs(season?.postSeasonEndDate))
      }
    }
  }, [season])

  return (
    <Grid2 container
           flexDirection={"column"}>

      <Grid2 container
             flexDirection={"row"}
             justifyContent={"center"}
             alignItems={"center"}
             paddingTop={2}
             paddingBottom={2}>
        <ChevronLeftIcon fontSize={"large"} onClick={() => setSelectedDate(selectedDate.subtract(1, "day"))} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Select Date"
                      views={["month", "day"]}
                      value={selectedDate}
                      minDate={dayJs(season?.regularSeasonStartDate)}
                      maxDate={dayJs(season?.postSeasonEndDate)}
                      onChange={(date, context) => {
                        if (context.validationError) return
                        if (date) setSelectedDate(date)
                      }}/>
        </LocalizationProvider>
        <ChevronRightIcon fontSize={"large"} onClick={() => setSelectedDate(selectedDate.add(1, "day"))} />
      </Grid2>

      <Grid2>
        <CurrentSeries selectedDate={selectedDate} />
      </Grid2>
    </Grid2>
  )
}