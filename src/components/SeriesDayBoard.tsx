import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useSeriesForDate } from '../api/queries'
import { DateNavigation } from './DateNavigation'
import { QueryState } from './QueryState'
import { SERIES_CARD_MAX_WIDTH, SeriesCard } from './SeriesCard'

/** At most 2 columns; board centered in the page (Stack stretch + maxWidth alone left-aligns). */
const SERIES_DAY_GAP_PX = 16
const BOARD_MAX_WIDTH = SERIES_CARD_MAX_WIDTH * 2 + SERIES_DAY_GAP_PX

const seriesGridSx = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${SERIES_DAY_GAP_PX}px`,
  justifyContent: 'center',
  width: '100%',
  maxWidth: BOARD_MAX_WIDTH,
  alignSelf: 'center',
  '& > *': {
    flex: {
      xs: '1 1 100%',
      sm: `0 1 ${SERIES_CARD_MAX_WIDTH}px`,
    },
    width: { xs: '100%', sm: 'auto' },
    maxWidth: SERIES_CARD_MAX_WIDTH,
  },
} as const

type SeriesDayBoardProps = {
  focusDate: string
  onFocusDateChange: (date: string) => void
  /** When set, prev/next and empty-state stay within this season's game days. */
  gameDates?: string[]
}

function SeriesSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center', width: '100%' }}>
      {title && (
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          {title}
        </Typography>
      )}
      {children}
    </Stack>
  )
}

export function SeriesDayBoard({
  focusDate,
  onFocusDateChange,
  gameDates: gameDatesOverride,
}: SeriesDayBoardProps) {
  const { data, isLoading, isError, error } = useSeriesForDate(focusDate)
  const playing = data?.playing ?? []
  const offday = data?.offday ?? []
  const gameDates = gameDatesOverride ?? data?.gameDates ?? []
  const empty = !isLoading && !isError && playing.length === 0 && offday.length === 0

  return (
    <Stack spacing={3} sx={{ alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <DateNavigation
          focusDate={focusDate}
          gameDates={gameDates}
          onChange={onFocusDateChange}
        />
      </Box>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={empty}
        emptyMessage="No series span this date. Try another game day."
      >
        {playing.length > 0 && (
          <SeriesSection title={offday.length > 0 ? 'Games today' : undefined}>
            <Box sx={seriesGridSx}>
              {playing.map((series) => (
                <SeriesCard key={series.id} series={series} focusDate={focusDate} />
              ))}
            </Box>
          </SeriesSection>
        )}

        {offday.length > 0 && (
          <SeriesSection title="Series in progress (off day)">
            <Box sx={seriesGridSx}>
              {offday.map((series) => (
                <SeriesCard key={series.id} series={series} muted focusDate={focusDate} />
              ))}
            </Box>
          </SeriesSection>
        )}
      </QueryState>
    </Stack>
  )
}
