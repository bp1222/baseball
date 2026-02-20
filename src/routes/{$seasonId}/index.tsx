import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'

import { SeasonSeries } from '@/features/schedule'
import { scheduleOptions } from '@/queries/schedule'
import { seasonsOptions } from '@/queries/season'
import { teamsOptions } from '@/queries/team'

/**
 * Search params schema for the season route
 */
type SeasonSearchParams = {
  /** Selected date in YYYY-MM-DD format */
  date?: string
}

/**
 * Season index route - displays all series for the selected date
 *
 * The date is stored in URL search params for:
 * - Shareable URLs
 * - Browser back/forward navigation
 * - Refresh persistence
 */
const SeasonComponent = () => {
  return <SeasonSeries />
}

export const Route = createFileRoute('/{$seasonId}/')({
  validateSearch: (search: Record<string, unknown>): SeasonSearchParams => ({
    date: typeof search.date === 'string' && dayjs(search.date).isValid() ? search.date : undefined,
  }),
  loader: async ({ context: { queryClient, defaultSeason }, params: { seasonId } }) => {
    const seasons = await queryClient.ensureQueryData(seasonsOptions)
    const season = seasons.find((s) => s.seasonId === (seasonId ?? defaultSeason))
    await Promise.all([
      queryClient.ensureQueryData(teamsOptions(seasonId ?? defaultSeason)),
      season ? queryClient.ensureQueryData(scheduleOptions(season)) : Promise.resolve(),
    ])
  },
  component: SeasonComponent,
})
