import {Alert, CircularProgress, Grid} from '@mui/material'
import {useParams} from '@tanstack/react-router'

import {DivisionStandings} from '@/components/TeamStats/DivisionStandings.tsx'
import {LeagueStandings} from '@/components/TeamStats/LeagueStandings.tsx'
import {TeamRanking} from '@/components/TeamStats/TeamRanking.tsx'
import {TeamSeriesRecord} from '@/components/TeamStats/TeamSeriesRecord.tsx'
import {useStandings} from '@/queries/standings.ts'
import {useTeam} from '@/queries/team.ts'

export const TeamStats = () => {
  const { seasonId, teamId: interestedTeamId } = useParams({strict: false})
  const { data: team } = useTeam(interestedTeamId)
  const { data: standings, isPending, isError } = useStandings(seasonId, team?.league)

  if (isPending) {
    return <CircularProgress />
  } else if (isError) {
    return <Alert severity={'error'}>Unable to acquire standings</Alert>
  }

  return (
    <Grid container
          justifyContent={'center'}
          flexGrow={1}>
      <Grid>
        <TeamSeriesRecord team={team!}/>
        <DivisionStandings team={team!} standings={standings}/>
        <LeagueStandings team={team!} standings={standings}/>
        <TeamRanking/>
      </Grid>
    </Grid>
  )
}
