import {Box, CircularProgress} from "@mui/material"
import {useContext, useEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {SeriesList} from "@/components/SeriesList"
import {AppStateContext} from "@/state"
import {Series} from "@/types/Series"
import {GetTeam} from "@/utils/GetTeam.ts"

export const TeamSeries = () => {
  const {state} = useContext(AppStateContext)
  const [series, setSeries] = useState<Series[]>([])
  const {teamId} = useParams()

  const team = GetTeam(state.teams, parseInt(teamId ?? ""))

  useEffect(() => {
    if (state.seasonSeries == undefined || team == undefined)
      return

    setSeries(state.seasonSeries
      .filter((s) => s.games
        .some((g) => g.teams.away.team.id == team.id || g.teams.home.team.id == team.id)
      )
    )
  }, [state.seasonSeries, team])

  return ((series?.length ?? 0) == 0) ? (
      <Box display={"flex"} justifyContent={"center"}>
        <CircularProgress/>
      </Box>
    ) : (
      <SeriesList series={series} interested={team}/>
    )
}
