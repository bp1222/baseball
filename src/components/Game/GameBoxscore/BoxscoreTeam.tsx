import { Grid, Typography } from '@mui/material'

import { TeamImage } from '@/components/Shared/TeamImage.tsx'
import { useTeam, useTeams } from '@/queries/team.ts'
import { GameTeam } from '@/types/GameTeam.ts'

type BoxscoreTeamProps = {
  gameTeam: GameTeam
}

export const BoxscoreTeam = ({ gameTeam }: BoxscoreTeamProps) => {
  const { data: teams } = useTeams()
  const { data: team } = useTeam(gameTeam.teamId)

  return (
    <Grid container flexDirection={'column'} alignItems={'center'} textAlign={'center'}>
      <Grid container flexDirection={'row'} alignItems={'center'}>
        <TeamImage team={team} />
        <Typography paddingLeft={1} fontSize={'larger'}>
          {gameTeam.score}
        </Typography>
      </Grid>
      <Grid>
        <Typography fontSize={'small'}>{teams?.find((t) => t.id == gameTeam.teamId)?.name}</Typography>
        <Typography fontSize={'x-small'}>
          {gameTeam.record.wins} - {gameTeam.record.losses}
        </Typography>
      </Grid>
    </Grid>
  )
}
