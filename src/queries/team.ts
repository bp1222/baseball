import {queryOptions, useQuery} from '@tanstack/react-query'

import {useSeason} from "@/queries/season.ts"
import {api} from '@/services/MlbAPI'
import {TeamFromMLBTeam} from '@/types/Team.ts'

export const teamsOptions = (seasonId?: string) => queryOptions({
  queryKey: ['teams', seasonId],
  staleTime: 'static',
  enabled: !!seasonId,
  queryFn: () => api.getTeams({
    sportId: 1,
    season: seasonId!,
    fields: [
      'teams', 'id', 'name', 'teamName', 'shortName', 'abbreviation', 'franchiseName',
      'league', 'division', 'nameShort'
    ],
    hydrate: 'division'
  }).then(
    ({teams}) => teams.sort(
      (a, b) => a.name.localeCompare(b.name) ?? 0
    ).map(
      (t) => TeamFromMLBTeam(t)
    )
  )
})

export const useTeam = (teamId: number) => {
  const { data: season } = useSeason()
  return useQuery({
    ...teamsOptions(season?.seasonId),
    select: (teams) => teams.find((t) => t.id == teamId),
  })
}

export const useTeams = () => {
  const { data: season } = useSeason()
  return useQuery(teamsOptions(season?.seasonId))
}