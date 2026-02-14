import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { GetTeamTheme } from "@/colors/index"
import { AppModals } from "@/components/AppModals"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { InterestedTeamProvider, useInterestedTeamContext } from "@/context/InterestedTeamContext"
import { ModalProvider } from "@/context/ModalContext"
import type { RouterContext } from "@/router/context"

/**
 * Inner component that uses the interested team context for theming
 */
const RootLayout = () => {
  const { teamId } = useInterestedTeamContext()

  return (
    <ThemeProvider theme={GetTeamTheme(teamId ?? 0)}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg" sx={{ minWidth: 0 }}>
        <Box sx={{ justifyItems: "center", minWidth: 0 }}>
          <Outlet />
        </Box>
      </Container>
      {/* Modals rendered at root level for single instance */}
      <AppModals />
    </ThemeProvider>
  )
}

const RootComponent = () => {
  return (
    <>
      <InterestedTeamProvider>
        <ModalProvider>
          <RootLayout />
        </ModalProvider>
      </InterestedTeamProvider>
      <TanStackRouterDevtools position="bottom-left" />
      <Footer />
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})
