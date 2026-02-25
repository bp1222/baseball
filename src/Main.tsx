import 'dayjs/locale/en'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isToday from 'dayjs/plugin/isToday'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { createRoot } from 'react-dom/client'

import type { RouterContext } from '@/router/context'
import { routeTree } from '@/routeTree.gen'

dayjs.locale('en')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.extend(isToday)

const queryClient = new QueryClient()
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    defaultSeason: dayjs().format('YYYY'),
  } satisfies RouterContext,
  history: createHashHistory(),
  defaultStaleTime: 1000 * 60 * 5, // 5 minutes
  scrollRestoration: true,
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
)
