import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createHashHistory, createRouter } from '@tanstack/react-router'
import './index.css'
import { hasAnalyticsConsent, initAnalytics, trackPageView } from './lib/analytics'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Hash history for GitHub Pages (no server rewrite support).
const history = createHashHistory()

const router = createRouter({
  routeTree,
  history,
  context: { queryClient },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

if (hasAnalyticsConsent()) {
  initAnalytics()
}
router.subscribe('onResolved', ({ toLocation }) => {
  trackPageView(`${toLocation.pathname}${toLocation.searchStr}`)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
