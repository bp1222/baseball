/**
 * MLB API Service Layer
 *
 * This module provides raw fetch functions for MLB data.
 * All caching is handled by TanStack Query - do NOT add memoization here.
 *
 * Uses the split stats-api clients (GamesApi, ReferenceApi, etc.) with shared
 * no-cache middleware so TanStack Query controls freshness.
 */

import type { RequestContext } from '@bp1222/stats-api'
import { GamesApi, PeopleApi, ReferenceApi, ScheduleApi, StandingsApi } from '@bp1222/stats-api'

const noCacheMiddleware = async (ctx: RequestContext) => {
  ctx.init.cache = 'no-cache'
  return ctx
}

export const gamesApi = new GamesApi().withPreMiddleware(noCacheMiddleware)
export const referenceApi = new ReferenceApi().withPreMiddleware(noCacheMiddleware)
export const scheduleApi = new ScheduleApi().withPreMiddleware(noCacheMiddleware)
export const peopleApi = new PeopleApi().withPreMiddleware(noCacheMiddleware)
export const standingsApi = new StandingsApi().withPreMiddleware(noCacheMiddleware)
