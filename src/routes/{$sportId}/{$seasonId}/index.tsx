import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'

import { SeasonSeries } from '@/components/SeasonSeries/SeasonSeries.tsx'
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

export const Route = createFileRoute('/{$sportId}/{$seasonId}/')({
  validateSearch: (search: Record<string, unknown>): SeasonSearchParams => ({
    date: typeof search.date === 'string' && dayjs(search.date).isValid() ? search.date : undefined,
  }),
  loader: async ({ context: { queryClient, defaultSeason }, params: { seasonId } }) => {
    await import('@/lib/dayjs')
    const [seasons, teams] = await Promise.all([
      queryClient.ensureQueryData(seasonsOptions),
      queryClient.ensureQueryData(teamsOptions(seasonId ?? defaultSeason)),
    ])
    const season = seasons.find((s) => s.seasonId === (seasonId ?? defaultSeason))
    if (season && teams.length) {
      await queryClient.ensureQueryData(scheduleOptions(season, teams))
    }
  },
  component: () => <SeasonSeries />,
})
