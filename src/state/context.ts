import {createContext} from "react"

import {AppStateDispatch} from "./actions.ts"
import {AppState} from "./state.ts"

export const AppStateContext = createContext<{
  state: AppState;
  dispatch: AppStateDispatch;
}>({
  state: {},
  dispatch: () => null,
})

