import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { createRoot } from 'react-dom/client'

import type { RouterContext } from '@/router/context'
import { routeTree } from '@/routeTree.gen'

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
