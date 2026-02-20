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

const gamesApi = new GamesApi().withPreMiddleware(noCacheMiddleware)
const referenceApi = new ReferenceApi().withPreMiddleware(noCacheMiddleware)
const scheduleApi = new ScheduleApi().withPreMiddleware(noCacheMiddleware)
const peopleApi = new PeopleApi().withPreMiddleware(noCacheMiddleware)
const standingsApi = new StandingsApi().withPreMiddleware(noCacheMiddleware)

/**
 * Unified API facade matching the shape expected by queries (getBoxscore, getSchedule, etc.)
 */
export const api = {
  getBoxscore: (req: Parameters<GamesApi['getBoxscore']>[0]) => gamesApi.getBoxscore(req),
  getLinescore: (req: Parameters<GamesApi['getLinescore']>[0]) => gamesApi.getLinescore(req),
  getSchedule: (req: Parameters<ScheduleApi['getSchedule']>[0]) => scheduleApi.getSchedule(req),
  getTeams: (req: Parameters<ReferenceApi['getTeams']>[0]) => referenceApi.getTeams(req),
  getAllSeasons: (req: Parameters<ReferenceApi['getAllSeasons']>[0]) => referenceApi.getAllSeasons(req),
  getLeagues: (req: Parameters<ReferenceApi['getLeagues']>[0]) => referenceApi.getLeagues(req),
  getDivisions: (req: Parameters<ReferenceApi['getDivisions']>[0]) => referenceApi.getDivisions(req),
  getStandings: (req: Parameters<StandingsApi['getStandings']>[0]) => standingsApi.getStandings(req),
  getPerson: (req: Parameters<PeopleApi['getPerson']>[0]) => peopleApi.getPerson(req),
}
