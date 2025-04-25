import {Box, CircularProgress} from "@mui/material"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {useAppState} from "@/state"
import {Series} from "@/types/Series"

import {SeriesList} from "./SeriesList.tsx"

export const TeamSeries = () => {
  const {seasonSeries} = useAppState()
  const [series, setSeries] = useState<Series[]>([])
  const {interestedTeamId} = useParams()

  useEffect(() => {
    if (seasonSeries == undefined || interestedTeamId == undefined)
      return

    setSeries(seasonSeries
      .filter((s) => s.games
        .some((g) => g.away.teamId == parseInt(interestedTeamId) || g.home.teamId == parseInt(interestedTeamId))
      )
    )
  }, [seasonSeries, interestedTeamId])

  return ((series?.length ?? 0) == 0) ? (
    <Box display={"flex"} justifyContent={"center"}>
      <CircularProgress/>
    </Box>
  ) : (
    <SeriesList series={series}/>
  )
}
