import { Color, Grid } from '@mui/material'

import { useTeam } from '@/queries/team'
import { DefaultGameResultColor } from '@/types/Game/GameResult'
import { GameTeam } from '@/types/GameTeam'

type GameScoreProps = {
  gameTeam: GameTeam
  /** When provided (e.g. from linescore for in-progress games), display instead of gameTeam.score */
  scoreOverride?: number
  color?: Color
  /** When true, use darker background and lighter text for dark mode */
  darkMode?: boolean
  /** Muted dark-mode colors (overrides color shades when provided) */
  darkModeColors?: { bg: string; border: string; text: string }
}

export const GameScore = ({ gameTeam, scoreOverride, color, darkMode = false, darkModeColors }: GameScoreProps) => {
  const isTbd = /[\d/]/
  const { data: team } = useTeam(gameTeam.teamId)

  const scoreColor: Color = color ?? DefaultGameResultColor
  const useMuted = darkMode && darkModeColors

  const bg = useMuted ? darkModeColors.bg : scoreColor[darkMode ? 800 : 50]
  const border = useMuted ? darkModeColors.border : scoreColor[darkMode ? 700 : 100]
  const text = useMuted ? darkModeColors.text : scoreColor[darkMode ? 100 : 700]

  return (
    <Grid container textAlign="center" sx={{ fontSize: '0.75rem', minWidth: 0 }}>
      <Grid
        borderRight={1}
        borderBottom={1}
        borderColor={border}
        bgcolor={bg}
        sx={{ width: '70%', minWidth: 0, paddingTop: 0.1, color: text }}
      >
        {isTbd.test(team?.abbreviation ?? '') ? 'TBD' : team?.abbreviation}
      </Grid>
      <Grid
        borderBottom={1}
        borderColor={border}
        bgcolor={bg}
        sx={{ width: '30%', minWidth: 0, paddingTop: 0.1, color: text }}
      >
        {scoreOverride !== undefined ? scoreOverride : (gameTeam.score ?? '-')}
      </Grid>
    </Grid>
  )
}
