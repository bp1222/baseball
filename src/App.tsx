import {CircularProgress, Container, CssBaseline, ThemeProvider} from "@mui/material"
import dayjs from "dayjs"
import React, {useLayoutEffect} from "react"
import {Outlet, useNavigate, useParams} from "react-router-dom"

import {GetTeamTheme} from "@/colors"
import {Footer} from "@/components/Footer.tsx"
import {Header} from "@/components/Header.tsx"
import {getSeasons} from "@/services/MlbAPI"
import {useAppState, useAppStateApi} from "@/state"

export const App = () => {
  const {seasons} = useAppState()
  const {setSeasons} = useAppStateApi()
  const {seasonId, interestedTeamId} = useParams()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    getSeasons().then((seasons) => {
      setSeasons(
        seasons.seasons
        .filter((s) => parseInt(s.seasonId!) > 1921)
        .reverse()
      )
    })
  }, [setSeasons])

  if (seasonId == undefined) {
    navigate("/" + dayjs().year())
    return
  }

  return (
    <ThemeProvider theme={GetTeamTheme(parseInt(interestedTeamId ?? "0"))}>
      <CssBaseline/>
      <Header/>
      <Container maxWidth={"lg"}>
        {seasons.length == 0 ? (
          <CircularProgress/>
        ) : (
          <Outlet/>
        )}
      </Container>
      <Footer/>
    </ThemeProvider>
  )
}