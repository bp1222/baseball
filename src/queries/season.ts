import {queryOptions, useQuery} from '@tanstack/react-query'
import {useParams} from '@tanstack/react-router'

import {Route} from "@/routes/__root.tsx"
import {api} from '@/services/MlbAPI/index.ts'

export const seasonsOptions = queryOptions({
  queryKey: ['seasons'],
  staleTime: 'static',
  queryFn: () => api.getAllSeasons({sportId: 1}).then(
    ({seasons}) => seasons.filter(
      (s) => parseInt(s.seasonId) > 1921
    ).reverse()
  )
})

export const useSeasons = () => useQuery(seasonsOptions)

export const useSeason = () => {
  const { defaultSeason } = Route.useRouteContext()
  const params = useParams({strict: false})
  const seasonId = params.seasonId ?? defaultSeason
  return useQuery({
    ...seasonsOptions,
    select: (seasons) => seasons.find((s) => s.seasonId === seasonId)!
  })
}