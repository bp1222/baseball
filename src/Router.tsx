import {lazy} from "react"
import {HashRouter, Route, Routes} from "react-router-dom"

import {App} from "@/App.tsx"

const Season = lazy(() => import("@/pages/Season.tsx"))
const CurrentDay = lazy(() => import("@/pages/CurrentDay.tsx"))
const Team = lazy(() => import("@/pages/Team.tsx"))

export const ApplicationRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={"/"} element={<App/>}>
          <Route path={":seasonId"} element={<Season/>}>
            <Route index element={<CurrentDay/>}/>
            <Route path={":teamId"} element={<Team/>}/>
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  )
}