import {AppStateContext} from "../state/Context.tsx"
import {lazy, Suspense, useContext, useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {Box} from "@mui/material"
import {LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"

import dayJs from "../utils/dayjs.ts"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CurrentSeries = lazy(() => import("./CurrentSeries.tsx"))

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
    <>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <ChevronLeftIcon fontSize={"large"} onClick={() => setSelectedDate(selectedDate.subtract(1, "day"))} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            views={["month", "day"]}
            value={selectedDate}
            minDate={dayJs(season?.regularSeasonStartDate)}
            maxDate={dayJs(season?.postSeasonEndDate)}
            onChange={(date, context) => {
              if (context.validationError) return
              if (date) setSelectedDate(date)
            }}
          ></DatePicker>
        </LocalizationProvider>
        <ChevronRightIcon fontSize={"large"} onClick={() => setSelectedDate(selectedDate.add(1, "day"))} />
      </Box>

      <Suspense fallback={<div>Loading...</div>}>
        <CurrentSeries selectedDate={selectedDate} />
      </Suspense>
    </>
  )
}