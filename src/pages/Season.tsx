import {Box, CircularProgress} from "@mui/material"
import {useEffect} from "react"
import {Outlet, useParams} from "react-router-dom"

import {getSeasonSchedule} from "@/services/MlbAPI"
import {useAppState, useAppStateApi, useAppStateUtil} from "@/state"

export {Season as default}
const Season = () => {
  const {seasonSeries} = useAppState()
  const {setSeasonSeries} = useAppStateApi()
  const {getSeason} = useAppStateUtil()
  const {seasonId} = useParams()
  const season = getSeason(seasonId)

  useEffect(() => {
    if (season) {
      getSeasonSchedule(season).then((schedule) => setSeasonSeries(schedule))
    }
    return () => {
      setSeasonSeries([])
    }
  }, [setSeasonSeries, season])

  return seasonSeries.length == 0 ? (
    <Box display={"flex"} justifyContent={"center"}>
      <CircularProgress/>
    </Box>
  ) : (
    <Outlet/>
  )
}