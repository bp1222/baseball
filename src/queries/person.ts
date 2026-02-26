/**
 * Person Query
 *
 * Fetches and caches a single person (player) with career season stats
 * via getPerson API. Used in the player modal from boxscore.
 */

import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/services/MlbAPI'

const PERSON_STALE_TIME = 1000 * 60 * 5 // 5 minutes

/** Hydrate person with year-by-year hitting and pitching stats for career table */
const PERSON_HYDRATE = 'currentTeam,stats(group=[hitting,pitching],type=[yearByYear])'

export const personOptions = (personId: string) =>
  queryOptions({
    queryKey: ['person', personId],
    staleTime: PERSON_STALE_TIME,
    enabled: !!personId,
    queryFn: async () => {
      const res = await api.getPerson({
        personId: Number(personId),
        hydrate: PERSON_HYDRATE,
      })
      const person = res.people?.[0]
      if (!person) throw new Error('Person not found')
      console.log(person)
      return person
    },
  })

/**
 * Get person (player) by ID with career season stats
 */
export const usePerson = (personId: string | null) => {
  return useQuery(personOptions(personId ?? ''))
}

export type PersonGameLogGroup = 'hitting' | 'pitching'

export const personGameLogOptions = (personId: string | null, season: string | null, group: PersonGameLogGroup) =>
  queryOptions({
    queryKey: ['person', personId, 'gameLog', season, group],
    staleTime: PERSON_STALE_TIME,
    enabled: !!personId && !!season,
    queryFn: async () => {
      const res = await api.getPersonStats({
        personId: Number(personId!),
        stats: 'gameLog',
        group,
        season: season!,
      })
      const gameLog = res.stats?.find((s) => s.type?.displayName === 'gameLog' && s.group?.displayName === group)
      return gameLog?.splits ?? []
    },
  })

/**
 * Get game-by-game stats for a player in a given season (hitting or pitching).
 */
export const usePersonGameLog = (personId: string | null, season: string | null, group: PersonGameLogGroup) =>
  useQuery(personGameLogOptions(personId, season, group))
