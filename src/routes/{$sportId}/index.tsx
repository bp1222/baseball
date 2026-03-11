import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/{$sportId}/')({
  beforeLoad: ({ context: { defaultSeason } }) => {
    throw redirect({
      to: '/1/{$seasonId}',
      params: {
        seasonId: defaultSeason,
      },
    })
  },
  component: () => <Outlet />,
})
