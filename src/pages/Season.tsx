import {useContext, useEffect} from "react"
import {Outlet, useParams} from "react-router-dom"

import {getSeasonSchedule} from "@/services/MlbAPI"
import {AppStateAction} from "@/state/actions.ts"
import {AppStateContext} from "@/state/context.ts"
import {GenerateSeasonSeries} from "@/utils/Series/GenerateSeasonSeries.ts"

export {Season as default}
const Season = () => {
  const {state, dispatch} = useContext(AppStateContext)
  const {seasonId} = useParams()
  const season = state.seasons?.find((s) => s.seasonId == seasonId)

  useEffect(() => {
    if (season == undefined) return

    const refreshData = () => {
      getSeasonSchedule(season).then((schedule) => {
        dispatch({
          type: AppStateAction.SeasonSeries,
          series: GenerateSeasonSeries(schedule.dates.flatMap((d) => d.games))
        })
      })
    }

    // Initial Load
    refreshData()

    const refreshIntervalRef = setInterval(() => {
      refreshData()
    }, 1000 * 60) // 1 minute

    return () => {
      clearInterval(refreshIntervalRef)
    }
  }, [dispatch, season])

  return (
    <Outlet/>
  )
}