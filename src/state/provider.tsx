import {MlbApi} from "@bp1222/stats-api"
import {PropsWithChildren, useEffect, useReducer} from "react"

import {AppStateAction} from "@/state/actions.ts"

import {AppStateContext} from "./context.ts"
import {reducer} from "./reducer.ts"

const mlbApi = new MlbApi()

export function AppStateProvider({children}: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, {})

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
    })
  }, [dispatch])

  return (
    <AppStateContext.Provider value={{state, dispatch}}>
      {children}
    </AppStateContext.Provider>
  )
}
