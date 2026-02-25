import type { PaletteColor } from '@mui/material'

import { GameResult } from '@/types/Game/GameResult'

export type GameResultPalette = {
  [key in GameResult]: PaletteColor
}

export const gameResultLight: GameResultPalette = {
  [GameResult.Win]: { light: '#e8f5e9', main: '#66bb6a', dark: '#81c784', contrastText: '#2e7d32' },
  [GameResult.Loss]: { light: '#ffebee', main: '#ef5350', dark: '#e57373', contrastText: '#c62828' },
  [GameResult.Tie]: { light: '#e3f2fd', main: '#42a5f5', dark: '#64b5f6', contrastText: '#1565c0' },
  [GameResult.Unknown]: { light: '#fafafa', main: '#bdbdbd', dark: '#e0e0e0', contrastText: '#424242' },
  [GameResult.Home]: { light: '#fafafa', main: '#bdbdbd', dark: '#e0e0e0', contrastText: '#424242' },
  [GameResult.Away]: { light: '#fafafa', main: '#bdbdbd', dark: '#e0e0e0', contrastText: '#424242' },
}

export const gameResultDark: GameResultPalette = {
  [GameResult.Win]: { light: '#1a2e1a', main: '#2d4a2d', dark: '#2d4a2d', contrastText: '#b8d4b8' },
  [GameResult.Loss]: { light: '#2e1a1a', main: '#4a2d2d', dark: '#4a2d2d', contrastText: '#d4b8b8' },
  [GameResult.Tie]: { light: '#1a1a2e', main: '#2d2d4a', dark: '#2d2d4a', contrastText: '#b8b8d4' },
  [GameResult.Unknown]: { light: '#424242', main: '#616161', dark: '#616161', contrastText: '#f5f5f5' },
  [GameResult.Home]: { light: '#424242', main: '#616161', dark: '#616161', contrastText: '#f5f5f5' },
  [GameResult.Away]: { light: '#424242', main: '#616161', dark: '#616161', contrastText: '#f5f5f5' },
}
