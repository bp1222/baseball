import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context: { defaultSeason } }) => {
    throw redirect({
      to: '/{$seasonId}',
      params: {
        seasonId: defaultSeason,
      },
    })
  },
})
