import type { PaletteColor } from '@mui/material'

import { GameStatus } from '@/types/Game/GameStatus'

export type GameStatusPalette = {
  [key in GameStatus]: PaletteColor
}

export const gameStatusLight: GameStatusPalette = {
  [GameStatus.Scheduled]: { light: '#fafafa', main: '#bdbdbd', dark: '#e0e0e0', contrastText: '#424242' },
  [GameStatus.InProgress]: { light: '#e3f2fd', main: '#42a5f5', dark: '#64b5f6', contrastText: '#1565c0' },
  [GameStatus.Final]: { light: '#fafafa', main: '#bdbdbd', dark: '#e0e0e0', contrastText: '#424242' },
  [GameStatus.Canceled]: { light: '#fafafa', main: '#bdbdbd', dark: '#e0e0e0', contrastText: '#424242' },
  [GameStatus.Postponed]: { light: '#fafafa', main: '#bdbdbd', dark: '#e0e0e0', contrastText: '#424242' },
  [GameStatus.Challenge]: { light: '#fafafa', main: '#bdbdbd', dark: '#e0e0e0', contrastText: '#424242' },
}

export const gameStatusDark: GameStatusPalette = {
  [GameStatus.Scheduled]: { light: '#424242', main: '#616161', dark: '#616161', contrastText: '#f5f5f5' },
  [GameStatus.InProgress]: { light: '#424242', main: '#757575', dark: '#616161', contrastText: '#f5f5f5' },
  [GameStatus.Final]: { light: '#424242', main: '#616161', dark: '#616161', contrastText: '#f5f5f5' },
  [GameStatus.Canceled]: { light: '#2e251a', main: '#4a3d2d', dark: '#4a3d2d', contrastText: '#e0d4b8' },
  [GameStatus.Postponed]: { light: '#424242', main: '#616161', dark: '#616161', contrastText: '#f5f5f5' },
  [GameStatus.Challenge]: { light: '#424242', main: '#616161', dark: '#616161', contrastText: '#f5f5f5' },
}
