import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context: { defaultSport, defaultSeason } }) => {
    throw redirect({
      to: `/{$sportId}/{$seasonId}`,
      params: {
        sportId: defaultSport,
        seasonId: defaultSeason,
      },
    })
  },
})
