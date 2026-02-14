/**
 * Season Series view - displays all series for the selected date
 *
 * This is the main orchestrator component that composes:
 * - DateNavigation: Date picker and quick navigation buttons
 * - SeriesGroups: Groups series by "has game today" vs "in progress"
 * - NoGamesMessage: Empty state when no games found
 */

import {Alert, Box, Button, Grid} from "@mui/material"

import {useDateNavigation, useDatesWithGames, useFilteredSeries} from "@/hooks"

import {DateNavigation} from "./DateNavigation"
import {NoGamesMessage} from "./NoGamesMessage"
import {SeriesCardSkeleton} from "./SeriesCardSkeleton"
import {SeriesGroups} from "./SeriesGroups"

export const SeasonSeries = () => {
  const {
    selectedDate,
    setSelectedDate,
    goToToday,
    goToNextGameDay,
    goToPrevGameDay,
    goToNextDay,
    goToPrevDay,
    minDate,
    maxDate,
    hasPrevGameDay,
    hasNextGameDay,
  } = useDateNavigation()

  const { datesSet } = useDatesWithGames()

  const {
    allSeries,
    seriesWithGameToday,
    seriesInProgressOnly,
    showGroups,
    isPending,
    isError,
    refetch,
  } = useFilteredSeries(selectedDate)

  const contentMaxWidth = "80%"

  // Loading state
  if (isPending) {
    return (
      <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: contentMaxWidth }, mx: "auto", minWidth: 0 }}>
        <DateNavigation
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onPrevDay={goToPrevDay}
          onNextDay={goToNextDay}
          onToday={goToToday}
          onPrevGameDay={goToPrevGameDay}
          onNextGameDay={goToNextGameDay}
          minDate={minDate}
          maxDate={maxDate}
          datesWithGames={datesSet}
          hasPrevGameDay={hasPrevGameDay}
          hasNextGameDay={hasNextGameDay}
          disabled
        />
        <Grid
          container
          id="seriesList"
          width="100%"
          minWidth={0}
          rowSpacing={1.5}
          columnSpacing={0.5}
          columns={{ xs: 1, md: 2 }}
        >
          {[1, 2, 3].map((i) => (
            <Grid key={i} container size={1} justifyContent="center" flexGrow={1} minWidth={0}>
              <SeriesCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  // Error state
  if (isError) {
    return (
      <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: contentMaxWidth }, mx: "auto", minWidth: 0 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          padding={2}
        >
          <Alert severity="error">
            Error loading schedule. Check back later or try again.
          </Alert>
          <Button variant="contained" onClick={() => void refetch()} size="small">
            Retry
          </Button>
        </Box>
      </Box>
    )
  }

  // Empty state
  if (allSeries.length === 0) {
    return (
      <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: contentMaxWidth }, mx: "auto", minWidth: 0 }}>
        <DateNavigation
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onPrevDay={goToPrevDay}
          onNextDay={goToNextDay}
          onToday={goToToday}
          onPrevGameDay={goToPrevGameDay}
          onNextGameDay={goToNextGameDay}
          minDate={minDate}
          maxDate={maxDate}
          datesWithGames={datesSet}
          hasPrevGameDay={hasPrevGameDay}
          hasNextGameDay={hasNextGameDay}
        />
        <NoGamesMessage />
      </Box>
    )
  }

  // Normal state with series
  return (
    <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: contentMaxWidth }, mx: "auto", minWidth: 0 }}>
      <DateNavigation
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onPrevDay={goToPrevDay}
        onNextDay={goToNextDay}
        onToday={goToToday}
        onPrevGameDay={goToPrevGameDay}
        onNextGameDay={goToNextGameDay}
        minDate={minDate}
        maxDate={maxDate}
        datesWithGames={datesSet}
        hasPrevGameDay={hasPrevGameDay}
        hasNextGameDay={hasNextGameDay}
      />
      <SeriesGroups
        allSeries={allSeries}
        seriesWithGameToday={seriesWithGameToday}
        seriesInProgressOnly={seriesInProgressOnly}
        showGroups={showGroups}
        selectedDate={selectedDate}
      />
    </Box>
  )
}
