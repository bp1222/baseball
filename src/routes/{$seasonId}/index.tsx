import {Alert, Box, CircularProgress} from '@mui/material'
import {createFileRoute} from '@tanstack/react-router'

import {SeasonSeries} from '@/components/SeasonSeries.tsx'
import {seasonsOptions, useSeason} from '@/queries/season.ts'
import {teamsOptions, useTeams} from '@/queries/team.ts'

const SeasonComponent = () => {
  const { data: season, isPending: isPendingSeason, isError: isErrorSeason } = useSeason()
  const { data: teams, isPending: isPendingTeams, isError: isErrorTeams } = useTeams()

  if (isPendingSeason || isPendingTeams) {
    return (
      <Box width={'fit-content'}>
        <CircularProgress />
      </Box>
    )
  } else if (isErrorTeams || isErrorSeason) {
    return (
      <Box width={'fit-content'}>
        <Alert severity={'error'}>Error Loading Teams or Seasons</Alert>
      </Box>
    )
  }

  return (
    <SeasonSeries
      teams={teams}
      season={season}
    />
  )
}

export const Route = createFileRoute('/{$seasonId}/')({
  loader: ({ context: { queryClient, defaultSeason }, params: { seasonId } }) => {
    queryClient.ensureQueryData(seasonsOptions)
    queryClient.ensureQueryData(teamsOptions(seasonId ?? defaultSeason))
  },
  component: SeasonComponent,
})