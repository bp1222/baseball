import { MlbApi } from "@bp1222/stats-api"
import {Container, CssBaseline, ThemeProvider} from "@mui/material"
import { useContext, useEffect } from "react"
import { Outlet, useNavigate, useParams } from "react-router-dom"

import GetTheme from "./colors"
import Footer from "./components/header/Footer.tsx"
import Header from "./components/header/Header.tsx"
import { AppStateAction } from "./state/Actions.ts"
import { AppStateContext } from "./state/Context.tsx"

const mlbApi = new MlbApi()

export const Component = () => {
  const {dispatch} = useContext(AppStateContext)
  const {seasonId, teamId} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    mlbApi.getAllSeasons({
      sportId: 1
    }).then((seasons) => {
      dispatch({
        type: AppStateAction.Seasons,
        seasons:
          seasons.seasons
            ?.filter((s) => parseInt(s.seasonId!) > 1921)
            .reverse() ?? [],
      })

      if (seasonId == undefined) {
        navigate("/" + new Date().getFullYear())
        return
      }
    })
  }, [dispatch, navigate, seasonId])

  useEffect(() => {
    if (seasonId == null)
      return

    mlbApi.getTeams({
      sportId: 1,
      leagueIds: [103, 104],
      season: seasonId,
    }).then((teams) => {
      dispatch({
        type: AppStateAction.Teams,
        teams: teams.teams!.sort((a, b) => a.name?.localeCompare(b.name!) ?? 0),
      })
    })
  }, [dispatch, seasonId])

  return (
    <ThemeProvider theme={GetTheme(parseInt(teamId ?? '0'))}>
      <CssBaseline />
      <Header/>
      <Container maxWidth={"lg"}>
        <Outlet />
      </Container>
      <Footer/>
    </ThemeProvider>
  )
}
