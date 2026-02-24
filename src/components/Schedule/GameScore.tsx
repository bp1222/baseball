import { Grid, type PaletteColor } from '@mui/material'

import { useTeam } from '@/queries/team'
import { GameTeam } from '@/types/GameTeam'

type GameScoreProps = {
  gameTeam: GameTeam
  scoreOverride?: number
  colors: PaletteColor
}

export const GameScore = ({ gameTeam, scoreOverride, colors }: GameScoreProps) => {
  const isTbd = /[\d/]/
  const { data: team } = useTeam(gameTeam.teamId)

  return (
    <Grid container textAlign="center" sx={{ fontSize: '0.75rem', minWidth: 0 }}>
      <Grid
        borderRight={1}
        borderBottom={1}
        borderColor={colors.main}
        bgcolor={colors.light}
        sx={{ width: '70%', minWidth: 0, paddingTop: 0.1, color: colors.contrastText }}
      >
        {isTbd.test(team?.abbreviation ?? '') ? 'TBD' : team?.abbreviation}
      </Grid>
      <Grid
        borderBottom={1}
        borderColor={colors.main}
        bgcolor={colors.light}
        sx={{ width: '30%', minWidth: 0, paddingTop: 0.1, color: colors.contrastText }}
      >
        {scoreOverride !== undefined ? scoreOverride : (gameTeam.score ?? '-')}
      </Grid>
    </Grid>
  )
}
