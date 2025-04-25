import {CircularProgress, Container, CssBaseline, ThemeProvider} from "@mui/material"
import dayjs from "dayjs"
import React, {useEffect, useLayoutEffect} from "react"
import {Outlet, useNavigate, useParams} from "react-router-dom"

import {GetTeamTheme} from "@/colors"
import {Footer} from "@/components/Footer.tsx"
import {Header} from "@/components/Header.tsx"
import {getDivisions, getLeagues, getSeasons, getTeams} from "@/services/MlbAPI"
import {useAppState, useAppStateApi, useAppStateUtil} from "@/state"

export const App = () => {
  const {seasons, leagues, divisions, teams} = useAppState()
  const {setSeasons, setLeagues, setDivisions, setTeams} = useAppStateApi()
  const {getSeason} = useAppStateUtil()
  const {seasonId, interestedTeamId} = useParams()
  const navigate = useNavigate()
  const season = getSeason(seasonId)

  useLayoutEffect(() => {
    getSeasons().then((seasons) => {
      setSeasons(
        seasons.seasons
        .filter((s) => parseInt(s.seasonId!) > 1921)
        .reverse()
      )
    })
  }, [setSeasons])

  useEffect(() => {
    if (season) {
      getLeagues(season).then((leagues) => setLeagues(leagues))
      getDivisions(season).then((divisions) => setDivisions(divisions))
      getTeams(season).then((teams) => setTeams(teams))
    }
  }, [season, setDivisions, setLeagues, setTeams])

  if (seasonId == undefined) {
    navigate("/" + dayjs().year())
    return
  }

  return (
    <ThemeProvider theme={GetTeamTheme(parseInt(interestedTeamId ?? "0"))}>
      <CssBaseline/>
      <Header/>
      <Container maxWidth={"lg"}>
        {seasons.length == 0 || teams.length == 0 || leagues.length == 0 || divisions.length == 0 ? (
          <CircularProgress/>
        ) : (
          <Outlet/>
        )}
      </Container>
      <Footer/>
    </ThemeProvider>
  )
}