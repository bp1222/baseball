import {useCallback, useContext, useEffect, useRef} from "react"
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

  const refreshIntervalRef = useRef(0)

  const refreshData = useCallback(() => {
    if (season == undefined) return
    getSeasonSchedule(season).then((schedule) => {
      dispatch({
        type: AppStateAction.SeasonSeries,
        series: GenerateSeasonSeries(schedule.dates.flatMap((d) => d.games))
      })
    })
  }, [dispatch, season])

  useEffect(() => {
    // @ts-expect-error - @types/node ruins the correct return of setInterval
    refreshIntervalRef.current = setInterval(() => {
      refreshData()
    }, 1000 * 60) // 1 minute

    return () => {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  return (
    <Outlet/>
  )
}