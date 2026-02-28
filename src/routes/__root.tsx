import { Box, Container } from '@mui/material'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Footer } from '@/components/Layout/Footer'
import { Header } from '@/components/Layout/Header'
import { AppModals } from '@/components/Modals/AppModals'
import { InterestedTeamProvider } from '@/context/InterestedTeamContext'
import { ModalProvider } from '@/context/ModalContext'
import { AppThemeProvider } from '@/context/ThemeModeContext'
import type { RouterContext } from '@/router/context'

/** Loads and renders React Query and Router devtools only in development. Not in production bundle. */
const DevTools = () => {
  const [devtools, setDevtools] = useState<React.ReactNode>(null)
  useEffect(() => {
    if (!import.meta.env.DEV) return
    Promise.all([
      import('@tanstack/react-query-devtools').then((m) => m.ReactQueryDevtools),
      import('@tanstack/react-router-devtools').then((m) => m.TanStackRouterDevtools),
    ]).then(([ReactQueryDevtools, TanStackRouterDevtools]) => {
      setDevtools(
        <>
          <ReactQueryDevtools buttonPosition="bottom-right" />
          <TanStackRouterDevtools position="bottom-left" />
        </>,
      )
    })
  }, [])
  return devtools
}

const RootComponent = () => {
  return (
    <>
      <InterestedTeamProvider>
        <AppThemeProvider>
          <ModalProvider>
            <Header />
            <Container maxWidth="lg" sx={{ minWidth: 0 }}>
              <Box sx={{ justifyItems: 'center', minWidth: 0 }}>
                <Outlet />
              </Box>
            </Container>
            <AppModals />
            <Footer />
          </ModalProvider>
        </AppThemeProvider>
      </InterestedTeamProvider>
      <DevTools />
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})
