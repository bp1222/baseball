import { Grid, Typography } from '@mui/material'

import { useTeams } from '@/queries/team.ts'
import { GetTeamImage } from '@/shared/components/GetTeamImage'
import { GameTeam } from '@/types/GameTeam.ts'

type BoxscoreTeamProps = {
  gameTeam: GameTeam
}

export const BoxscoreTeam = ({ gameTeam }: BoxscoreTeamProps) => {
  const { data: teams } = useTeams()

  return (
    <Grid container flexDirection={'column'} alignItems={'center'} textAlign={'center'}>
      <Grid container flexDirection={'row'} alignItems={'center'}>
        {GetTeamImage(teams?.find((t) => t.id == gameTeam.teamId))}
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
