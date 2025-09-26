import {Box, CircularProgress} from "@mui/material"
import {useEffect} from "react"
import {Outlet, useParams} from "react-router-dom"

import {getDivisions, getLeagues, getSeasonSchedule, getTeams} from "@/services/MlbAPI"
import {useAppState, useAppStateApi, useAppStateUtil} from "@/state"

export {Season as default}
const Season = () => {
  const {seasonSeries, teams, leagues, divisions} = useAppState()
  const {setSeasonSeries, setLeagues, setDivisions, setTeams} = useAppStateApi()
  const {getSeason} = useAppStateUtil()
  const {seasonId} = useParams()
  const season = getSeason(seasonId)

  useEffect(() => {
    if (season) {
      getSeasonSchedule(season).then((schedule) => setSeasonSeries(schedule))
      getLeagues(season).then((l) => setLeagues(l))
      getDivisions(season).then((d) => setDivisions(d))
    }

    return () => {
      setSeasonSeries([])
      setLeagues([])
      setDivisions([])
    }
  }, [season, setSeasonSeries, setLeagues, setDivisions])

  useEffect(() => {
    if (season && seasonSeries.length > 0) {
      const teamIds = new Set<number>()
      seasonSeries.forEach((s) => {
        s.games.forEach((g) => {
          teamIds.add(g.away.teamId)
          teamIds.add(g.home.teamId)
        })
      })

      getTeams(season, Array.from(teamIds)).then((t) => setTeams(t))
    }
    return () => {
      setTeams([])
    }
  }, [season, seasonSeries, setTeams])

  return (seasonSeries.length == 0 || teams.length == 0 || leagues.length == 0) ? (
    <Box display={"flex"} justifyContent={"center"}>
      <CircularProgress/>
    </Box>
  ) : (
    <Outlet/>
  )
}