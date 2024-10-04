import {Box, CircularProgress} from "@mui/material"
import {useContext, useEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {Series} from "../../models/Series.ts"
import {AppStateContext} from "../../state/Context.tsx"
import {FindTeam} from "../../utils/findTeam.ts"
import SeriesList from "../series/SeriesList.tsx"

const TeamSeries = () => {
  const { state } = useContext(AppStateContext)
  const [series, setSeries] = useState<Series[]>([])

  const {teamId} = useParams()

  const team = FindTeam(state.teams, parseInt(teamId ?? ""))

  useEffect(() => {
    if (state.seasonSeries == undefined || team == undefined) return
    setSeries(state.seasonSeries
      .filter((s) => s.games
        .some((g) => g.teams.away.team.id == team.id || g.teams.home.team.id == team.id)
      )
    )
  }, [state.seasonSeries, team])

  if ((series?.length ?? 0) == 0) {
    return (
      <Box display={"flex"} justifyContent={"center"}>
        <CircularProgress/>
      </Box>
    )
  }
  return (
    <SeriesList series={series} interested={team}/>
  )
}

export default TeamSeries