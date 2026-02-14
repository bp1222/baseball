import "dayjs/locale/en"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import {createHashHistory, createRouter, RouterProvider} from "@tanstack/react-router"
import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import isToday from "dayjs/plugin/isToday"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import {createRoot} from "react-dom/client"

import { routeTree } from "@/routeTree.gen"
import type { RouterContext } from "@/router/context"

dayjs.locale("en")

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.extend(isToday)

const queryClient = new QueryClient()
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    defaultSeason: dayjs().format("YYYY"),
  } satisfies RouterContext,
  history: createHashHistory(),
  defaultStaleTime: 1000 * 60 * 5, // 5 minutes
  scrollRestoration: true,
})

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/>
    <ReactQueryDevtools buttonPosition="bottom-right" />
  </QueryClientProvider>
)
