import { Box, Stack, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useSeriesForDate } from '../api/queries'
import { DateNavigation } from '../components/DateNavigation'
import { QueryState } from '../components/QueryState'
import { SeriesCard } from '../components/SeriesCard'
import { localToday } from '../lib/series'

const seriesGridSx = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(auto-fill, minmax(280px, 480px))',
  },
  justifyContent: 'center',
  justifyItems: 'center',
} as const

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const [focusDate, setFocusDate] = useState(localToday)
  const { data, isLoading, isError, error } = useSeriesForDate(focusDate)
  const playing = data?.playing ?? []
  const offday = data?.offday ?? []
  const empty = !isLoading && !isError && playing.length === 0 && offday.length === 0

  return (
    <Stack spacing={3}>
      <Box sx={{ textAlign: 'center' }}>
        <DateNavigation
          focusDate={focusDate}
          gameDates={data?.gameDates ?? []}
          onChange={setFocusDate}
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
          <Stack spacing={1.5}>
            {offday.length > 0 && <Typography variant="h5">Games today</Typography>}
            <Box sx={seriesGridSx}>
              {playing.map((series) => (
                <SeriesCard key={series.id} series={series} focusDate={focusDate} />
              ))}
            </Box>
          </Stack>
        )}

        {offday.length > 0 && (
          <Stack spacing={1.5}>
            <Typography variant="h5">Series in progress (off day)</Typography>
            <Box sx={seriesGridSx}>
              {offday.map((series) => (
                <SeriesCard key={series.id} series={series} muted focusDate={focusDate} />
              ))}
            </Box>
          </Stack>
        )}
      </QueryState>
    </Stack>
  )
}
