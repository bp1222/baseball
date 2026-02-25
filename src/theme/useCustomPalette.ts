import { useColorScheme } from '@mui/material'
import { useMemo } from 'react'

import { gameResultDark, gameResultLight, type GameResultPalette } from './gameResult'
import { gameStatusDark, gameStatusLight, type GameStatusPalette } from './gameStatus'
import { seriesBadgeDark, seriesBadgeLight, type SeriesBadgePalette } from './seriesBadge'
import { seriesResultDark, seriesResultLight, type SeriesResultPalette } from './seriesResult'
import { springTrainingDark, springTrainingLight, type SpringTrainingPalette } from './springTraining'

export interface CustomPalette {
  gameResult: GameResultPalette
  gameStatus: GameStatusPalette
  seriesResult: SeriesResultPalette
  seriesBadge: SeriesBadgePalette
  springTraining: SpringTrainingPalette
}

export const useCustomPalette = (): CustomPalette => {
  const { mode } = useColorScheme()
  const dark = mode === 'dark'

  return useMemo(
    () => ({
      gameResult: dark ? gameResultDark : gameResultLight,
      gameStatus: dark ? gameStatusDark : gameStatusLight,
      seriesResult: dark ? seriesResultDark : seriesResultLight,
      seriesBadge: dark ? seriesBadgeDark : seriesBadgeLight,
      springTraining: dark ? springTrainingDark : springTrainingLight,
    }),
    [dark],
  )
}
