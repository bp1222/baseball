import {Container, CssBaseline, ThemeProvider} from "@mui/material"
import {useContext, useLayoutEffect} from "react"
import {Outlet, useNavigate, useParams} from "react-router-dom"

import {GetTeamTheme} from "@/colors"
import {Footer} from "@/components/Footer"
import {Header} from "@/components/Header"
import {getTeamsForSeason} from "@/services/MlbAPI"
import {AppStateAction, AppStateContext} from "@/state"

export const App = () => {
  const {dispatch} = useContext(AppStateContext)
  const {seasonId, teamId} = useParams()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (seasonId == null) {
      navigate("/" + new Date().getFullYear())
      return
    }

    getTeamsForSeason(seasonId).then((teams) => {
      dispatch({
        type: AppStateAction.Teams,
        teams: teams.teams!.sort((a, b) => a.name?.localeCompare(b.name!) ?? 0),
      })
    })
  }, [dispatch, navigate, seasonId])

  return (
    <ThemeProvider theme={GetTeamTheme(parseInt(teamId ?? '0'))}>
      <CssBaseline/>
      <Header/>
      <Container maxWidth={"lg"}>
        <Outlet/>
      </Container>
      <Footer/>
    </ThemeProvider>
  )
}