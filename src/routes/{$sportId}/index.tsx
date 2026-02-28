import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

/**
 * Sport index route - displays all series for the given sport
 * This will set the sport context for all child routes, and allow for swapping
 * between sports.
 *
 * For instance, sport represents:
 * - MLB
 * - AAA Baseball
 * - AA Baseball
 * - High-A Baseball
 * - Low-A Baseball
 * - Negro Leagues
 */
const SportComponent = () => {
  return <Outlet />
}

export const Route = createFileRoute('/{$sportId}/')({
  beforeLoad: ({ context: { defaultSeason } }) => {
    throw redirect({
      to: '/1/{$seasonId}',
      params: {
        seasonId: defaultSeason,
      },
    })
  },
  component: SportComponent,
})
