import { Grid, type PaletteColor } from '@mui/material'

import { useLinescore } from '@/queries/linescore.ts'
import { useTeam } from '@/queries/team.ts'
import { Game } from '@/types/Game.ts'
import { GameStatus } from '@/types/Game/GameStatus.ts'
import { GameTeam } from '@/types/GameTeam.ts'

type GameScoreProps = {
  game: Game
  gameTeam: GameTeam
  colors: PaletteColor
}

export const GameScore = ({ game, gameTeam, colors }: GameScoreProps) => {
  const isTbd = /[\d/]/
  const { data: team } = useTeam(gameTeam.teamId)

  const isLive = game.gameStatus === GameStatus.InProgress
  const { data: linescore } = useLinescore(game.pk, isLive)
  const score =
    isLive && linescore
      ? game.home.teamId == gameTeam.teamId
        ? linescore.home.runs
        : linescore.away.runs
      : (gameTeam.score ?? '-')

  return (
    <Grid container textAlign="center" sx={{ fontSize: '0.75rem', minWidth: 0 }}>
      <Grid
        borderRight={1}
        borderBottom={1}
        bgcolor={colors.light}
        sx={{ width: '70%', minWidth: 0, paddingTop: 0.1, color: colors.contrastText }}
      >
        {isTbd.test(team?.abbreviation ?? '') ? 'TBD' : team?.abbreviation}
      </Grid>
      <Grid
        borderBottom={1}
        bgcolor={colors.light}
        sx={{ width: '30%', minWidth: 0, paddingTop: 0.1, color: colors.contrastText }}
      >
        {score}
      </Grid>
    </Grid>
  )
}
