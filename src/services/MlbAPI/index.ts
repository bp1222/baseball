/**
 * MLB API Service Layer
 *
 * This module provides raw fetch functions for MLB data.
 * All caching is handled by TanStack Query - do NOT add memoization here.
 *
 * Naming convention: fetchX for data fetchers
 */

import {MlbApi} from "@bp1222/stats-api"

/**
 * Configured MLB API client
 * - Disables browser cache to let TanStack Query manage freshness
 */
export const api = new MlbApi().withPreMiddleware(async (ctx) => {
  ctx.init.cache = "no-cache"
  return ctx
})
