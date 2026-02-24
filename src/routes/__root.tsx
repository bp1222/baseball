import { Box, Container } from '@mui/material'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Footer } from '@/components/Layout/Footer'
import { Header } from '@/components/Layout/Header'
import { AppModals } from '@/components/Modals'
import { InterestedTeamProvider } from '@/context/InterestedTeamContext'
import { ModalProvider } from '@/context/ModalContext'
import { AppThemeProvider } from '@/context/ThemeModeContext'
import type { RouterContext } from '@/router/context'

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
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})
