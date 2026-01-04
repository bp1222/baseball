import {Box, Container, CssBaseline, ThemeProvider} from "@mui/material"
import {createRootRouteWithContext, Outlet, useParams} from "@tanstack/react-router"
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools"
import React from "react"

import {GetTeamTheme} from "@/colors/index.ts"
import {Footer} from "@/components/Footer.tsx"
import {Header} from "@/components/Header.tsx"
import {RouterContext} from "@/Main.tsx"

const RootComponent = () => {
  const { teamId } = useParams({strict: false})

  return (
    <>
      <ThemeProvider theme={GetTeamTheme(teamId ?? 0)}>
        <CssBaseline/>
        <Header/>
        <Container maxWidth={"lg"}>
          <Box justifyItems={'center'}>
            <Outlet/>
          </Box>
        </Container>
      </ThemeProvider>
      <TanStackRouterDevtools position={"bottom-left"}/>
      <Footer/>
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})
