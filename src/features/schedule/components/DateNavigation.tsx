/**
 * Date navigation controls for the season series view
 *
 * Includes:
 * - Date picker with prev/next day chevrons
 * - Quick navigation buttons (Today, Prev/Next game day)
 */

import { Box, Button, Grid } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

import { GameDay } from './GameDay'

type DateNavigationProps = {
  /** Currently selected date */
  selectedDate: dayjs.Dayjs
  /** Callback when date changes */
  onDateChange: (date: dayjs.Dayjs) => void
  /** Navigate to previous day */
  onPrevDay: () => void
  /** Navigate to next day */
  onNextDay: () => void
  /** Navigate to today */
  onToday: () => void
  /** Navigate to previous game day */
  onPrevGameDay: () => void
  /** Navigate to next game day */
  onNextGameDay: () => void
  /** Minimum selectable date */
  minDate: dayjs.Dayjs
  /** Maximum selectable date */
  maxDate: dayjs.Dayjs
  /** Set of dates with games (YYYY-MM-DD format) for calendar highlighting */
  datesWithGames: Set<string>
  /** Whether there's a previous game day available */
  hasPrevGameDay: boolean
  /** Whether there's a next game day available */
  hasNextGameDay: boolean
  /** Disable all controls (for loading state) */
  disabled?: boolean
}

export const DateNavigation = ({
  selectedDate,
  onDateChange,
  onToday,
  onPrevGameDay,
  onNextGameDay,
  minDate,
  maxDate,
  datesWithGames,
  hasPrevGameDay,
  hasNextGameDay,
  disabled = false,
}: DateNavigationProps) => {
  return (
    <>
      {/* Date picker with chevrons */}
      <Grid
        container
        id="datePicker"
        alignItems="center"
        justifyContent="center"
        paddingTop={2}
        paddingBottom={1}
        sx={{ minWidth: 0 }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ minWidth: 0, display: 'flex', justifyContent: 'center' }}>
            <DatePicker
              label="Select Date"
              views={['month', 'day']}
              value={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
              slots={{ day: GameDay }}
              slotProps={{
                actionBar: { actions: ['today'] },
                day: { datesWithGames } as Record<string, unknown>,
              }}
              onChange={(date, context) => {
                if (!context.validationError && date) {
                  onDateChange(date)
                }
              }}
            />
          </Box>
        </LocalizationProvider>
      </Grid>

      {/* Quick navigation buttons */}
      <Grid container justifyContent="center" paddingBottom={2} sx={{ gap: 1, minWidth: 0, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" onClick={onPrevGameDay} disabled={disabled || !hasPrevGameDay}>
          Prev game day
        </Button>
        <Button size="small" variant="outlined" onClick={onToday} disabled={disabled}>
          Today
        </Button>
        <Button size="small" variant="outlined" onClick={onNextGameDay} disabled={disabled || !hasNextGameDay}>
          Next game day
        </Button>
      </Grid>
    </>
  )
}
