import type { PaletteColor } from '@mui/material'

import type { SpringLeague } from '@/types/Series'

export type SpringTrainingPalette = Record<SpringLeague, PaletteColor>

export const springTrainingLight: SpringTrainingPalette = {
  grapefruit: { light: '#eeeeee', main: '#f8bbd0', dark: '#f48fb1', contrastText: '#424242' },
  cactus: { light: '#eeeeee', main: '#81c784', dark: '#66bb6a', contrastText: '#424242' },
}

export const springTrainingDark: SpringTrainingPalette = {
  grapefruit: { light: '#424242', main: '#880e4f', dark: '#ad1457', contrastText: '#f5f5f5' },
  cactus: { light: '#424242', main: '#1b5e20', dark: '#2e7d32', contrastText: '#f5f5f5' },
}
