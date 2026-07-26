import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { AppShell } from '../components/AppShell'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { params, pathname } = useRouterState({
    select: (s) => ({
      params: s.matches[s.matches.length - 1]?.params as {
        year?: string
        teamId?: string
      },
      pathname: s.location.pathname,
    }),
  })

  return (
    <AppShell
      year={params?.year}
      teamId={params?.teamId ? Number(params.teamId) : undefined}
      flatBackground={pathname === '/'}
    >
      <Outlet />
    </AppShell>
  )
}
