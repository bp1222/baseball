import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'

import { SeasonSeries } from '@/components/Schedule/SeasonSeries'
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
    const [seasons, teams] = await Promise.all([
      queryClient.ensureQueryData(seasonsOptions),
      queryClient.ensureQueryData(teamsOptions(seasonId ?? defaultSeason)),
    ])
    const season = seasons.find((s) => s.seasonId === (seasonId ?? defaultSeason))
    if (season && teams.length) {
      await queryClient.ensureQueryData(scheduleOptions(season, teams))
    }
  },
  component: SeasonComponent,
})
