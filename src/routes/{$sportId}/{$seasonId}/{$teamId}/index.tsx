import { createFileRoute } from '@tanstack/react-router'

import { Team } from '@/components/Team/Team.tsx'
import { scheduleOptions } from '@/queries/schedule.ts'
import { seasonsOptions } from '@/queries/season.ts'
import { teamsOptions } from '@/queries/team.ts'

export const Route = createFileRoute('/{$sportId}/{$seasonId}/{$teamId}/')({
  loader: async ({ context: { queryClient, defaultSeason }, params: { seasonId } }) => {
    await import('@/lib/dayjs.ts')
    const [seasons, teams] = await Promise.all([
      queryClient.ensureQueryData(seasonsOptions),
      queryClient.ensureQueryData(teamsOptions(seasonId ?? defaultSeason)),
    ])
    const season = seasons.find((s) => s.seasonId === (seasonId ?? defaultSeason))
    if (season && teams.length) {
      await queryClient.ensureQueryData(scheduleOptions(season, teams))
    }
  },
  component: () => <Team />,
})
