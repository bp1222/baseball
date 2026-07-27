import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { AppShell } from '../components/AppShell'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const params = useRouterState({
    select: (s) =>
      s.matches[s.matches.length - 1]?.params as {
        year?: string
        teamId?: string
      },
  })

  return (
    <AppShell
      year={params?.year}
      teamId={params?.teamId ? Number(params.teamId) : undefined}
    >
      <Outlet />
    </AppShell>
  )
}
