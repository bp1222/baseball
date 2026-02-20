import type { QueryClient } from '@tanstack/react-query'

/**
 * Context provided to the TanStack Router tree.
 * Injected in Main.tsx and consumed by route loaders and components.
 */
export interface RouterContext {
  queryClient: QueryClient
  defaultSeason: string
}
