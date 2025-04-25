import "dayjs/locale/en"

import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import isToday from "dayjs/plugin/isToday"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import {createRoot} from "react-dom/client"

import {ApplicationRouter} from "@/Router.tsx"
import {AppStateProvider} from "@/state"

dayjs.locale("en")

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.extend(isToday)

createRoot(document.getElementById("root")!).render(
  <AppStateProvider>
    <ApplicationRouter/>
  </AppStateProvider>
)
