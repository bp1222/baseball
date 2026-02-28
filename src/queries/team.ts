/**
 * Teams Query
 *
 * Fetches and caches team data for a season.
 * Teams are static within a season, so we use Infinity stale time.
 */

import { queryOptions, useQuery } from '@tanstack/react-query'

import { useSeason } from '@/queries/season'
import { referenceApi } from '@/services/MlbAPI'
import { TeamFromMLBTeam } from '@/types/Team'

/**
 * Stale time: Infinity (static)
 * Team data doesn't change within a season.
 */
const TEAMS_STALE_TIME = Infinity

export const teamsOptions = (seasonId?: string) =>
  queryOptions({
    queryKey: ['teams', seasonId],
    staleTime: TEAMS_STALE_TIME,
    enabled: !!seasonId,
    queryFn: async () => {
      const { teams } = await referenceApi.getTeams({
        sportId: 1,
        season: seasonId!,
        fields: [
          'teams',
          'id',
          'name',
          'teamName',
          'shortName',
          'abbreviation',
          'franchiseName',
          'league',
          'division',
          'nameShort',
          'springLeague',
        ],
        hydrate: 'division',
      })
      return teams.sort((a, b) => a.name.localeCompare(b.name) ?? 0).map((t) => TeamFromMLBTeam(t))
    },
  })

/**
 * Get a single team by ID
 * Uses select to derive from the teams list (no extra fetch)
 */
export const useTeam = (teamId: number | undefined) => {
  const { data: season } = useSeason()
  return useQuery({
    ...teamsOptions(season?.seasonId),
    enabled: teamId != null && !!season?.seasonId,
    select: (teams) => (teamId != null ? teams.find((t) => t.id === teamId) : undefined),
  })
}

/**
 * Get all teams for the current season
 */
export const useTeams = () => {
  const { data: season } = useSeason()
  return useQuery(teamsOptions(season?.seasonId))
}
