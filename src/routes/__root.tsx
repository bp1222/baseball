import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { GetTeamTheme } from '@/colors/index'
import { AppModals } from '@/components/AppModals'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { InterestedTeamProvider, useInterestedTeamContext } from '@/context/InterestedTeamContext'
import { ModalProvider } from '@/context/ModalContext'
import { ThemeModeProvider, useThemeMode } from '@/context/ThemeModeContext'
import type { RouterContext } from '@/router/context'

/**
 * Inner component that uses the interested team context for theming
 */
const RootLayout = () => {
  const { teamId } = useInterestedTeamContext()
  const { mode } = useThemeMode()

  return (
    <ThemeProvider theme={GetTeamTheme(teamId ?? 0, mode)}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg" sx={{ minWidth: 0 }}>
        <Box sx={{ justifyItems: 'center', minWidth: 0 }}>
          <Outlet />
        </Box>
      </Container>
      <AppModals />
      <Footer />
    </ThemeProvider>
  )
}

const RootComponent = () => {
  return (
    <>
      <InterestedTeamProvider>
        <ThemeModeProvider>
          <ModalProvider>
            <RootLayout />
          </ModalProvider>
        </ThemeModeProvider>
      </InterestedTeamProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})
