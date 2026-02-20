import { Alert, Box, Button, Stack } from '@mui/material'

import { DivisionStandings } from '@/features/standings/components/DivisionStandings'
import { LeagueStandings } from '@/features/standings/components/LeagueStandings'
import { StandingsSkeleton } from '@/features/standings/components/StandingsSkeleton'
import { useStandings } from '@/queries/standings'
import { useTeam } from '@/queries/team'

import { SeriesRecordSkeleton } from './SeriesRecordSkeleton'
import { TeamRanking } from './TeamRanking'
import { TeamSeriesRecord } from './TeamSeriesRecord'

type TeamStatsProps = {
  seasonId?: string
  teamId?: number
}

export const TeamStats = ({ seasonId, teamId: interestedTeamId }: TeamStatsProps) => {
  const { data: team } = useTeam(interestedTeamId)
  const { data: standings, isPending, isError, refetch: refetchStandings } = useStandings(seasonId, team?.league)

  if (isPending) {
    return (
      <Stack spacing={0} sx={{ minWidth: 0, width: '100%' }}>
        <SeriesRecordSkeleton />
        <StandingsSkeleton label="Division Standings" rows={5} />
        <StandingsSkeleton label="League Standings" rows={6} />
      </Stack>
    )
  }
  if (isError) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Alert severity="error">Unable to load standings. Check back later or try again.</Alert>
        <Button variant="contained" size="small" onClick={() => void refetchStandings()}>
          Retry
        </Button>
      </Box>
    )
  }
  if (team == null) {
    return null
  }

  return (
    <Stack spacing={0} sx={{ minWidth: 0, width: '100%' }}>
      <TeamSeriesRecord team={team} />
      <DivisionStandings team={team} standings={standings} />
      <LeagueStandings team={team} standings={standings} />
      <TeamRanking />
    </Stack>
  )
}
