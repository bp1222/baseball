import {useContext, useEffect} from "react"
import {Outlet, useParams} from "react-router-dom"

import {getSeasonSchedule} from "@/services/MlbAPI"
import {AppStateAction, AppStateContext} from "@/state"
import {GenerateSeasonSeries} from "@/types/Series"

export const Season = () => {
  const {state, dispatch} = useContext(AppStateContext)
  const {seasonId} = useParams()
  const season = state.seasons?.find((s) => s.seasonId == seasonId)

  useEffect(() => {
    if (season == undefined) return
    getSeasonSchedule(season).then((schedule) => {
      dispatch({
        type: AppStateAction.SeasonSeries,
        series: GenerateSeasonSeries(schedule.dates.flatMap((d) => d.games))
      })
    })
  }, [dispatch, season])

  return (
    <Outlet/>
  )
}