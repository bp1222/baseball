import {PropsWithChildren, useEffect, useReducer} from "react"

import {getSeasons} from "@/services/MlbAPI"
import {AppStateAction} from "@/state/actions.ts"

import {AppStateContext} from "./context.ts"
import {reducer} from "./reducer.ts"

export function AppStateProvider({children}: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, {})

  useEffect(() => {
    getSeasons().then((seasons) => {
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
