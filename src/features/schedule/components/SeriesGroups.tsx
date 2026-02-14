/**
 * Groups series into sections based on whether they have a game today
 *
 * Renders:
 * - "Games today" section with series that have a game on the selected date
 * - "Series in progress" section with series that span the date but have no game
 * - Or just a flat list if there's only one group
 */

import { Box } from "@mui/material"
import dayjs from "dayjs"

import { SeriesList } from "./SeriesList"
import { Series } from "@/types/Series"

type SeriesGroupsProps = {
  /** All series to display */
  allSeries: Series[]
  /** Series with a game on the selected date */
  seriesWithGameToday: Series[]
  /** Series in progress but without a game on the selected date */
  seriesInProgressOnly: Series[]
  /** Whether to show grouped sections */
  showGroups: boolean
  /** Currently selected date */
  selectedDate: dayjs.Dayjs
}

export const SeriesGroups = ({
  allSeries,
  seriesWithGameToday,
  seriesInProgressOnly,
  showGroups,
  selectedDate,
}: SeriesGroupsProps) => {
  if (!showGroups) {
    return <SeriesList series={allSeries} selectedDate={selectedDate} />
  }

  return (
    <>
      {seriesWithGameToday.length > 0 && (
        <Box component="section" marginTop={2} marginBottom={1} sx={{ minWidth: 0 }}>
          <Box
            component="h3"
            sx={{ fontSize: "1rem", fontWeight: 600, marginBottom: 1 }}
          >
            Games today
          </Box>
          <SeriesList series={seriesWithGameToday} selectedDate={selectedDate} />
        </Box>
      )}
      {seriesInProgressOnly.length > 0 && (
        <Box component="section" marginTop={3} marginBottom={1} sx={{ minWidth: 0 }}>
          <Box
            component="h3"
            sx={{ fontSize: "1rem", fontWeight: 600, marginBottom: 1 }}
          >
            Series in progress (no game today)
          </Box>
          <SeriesList series={seriesInProgressOnly} selectedDate={selectedDate} />
        </Box>
      )}
    </>
  )
}
