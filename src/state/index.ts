import {useContext} from "react"

import {AppStateApiContext, AppStateContext, AppStateUtilContext} from "./context.ts"

export {AppStateProvider} from "./provider.tsx"

export const useAppStateUtil = () => useContext(AppStateUtilContext)
export const useAppStateApi = () => useContext(AppStateApiContext)
export const useAppState = () => useContext(AppStateContext)
