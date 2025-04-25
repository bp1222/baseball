import {createContext} from "react"

import {AppState, AppStateApi, AppStateUtil} from "./types.ts"

export const AppStateUtilContext = createContext<AppStateUtil>({} as AppStateUtil)
export const AppStateApiContext = createContext<AppStateApi>({} as AppStateApi)
export const AppStateContext = createContext<AppState>({} as AppState)

