import type { PaletteColor } from '@mui/material'

import { SeriesResult } from '@/types/Series/SeriesResult'

export type SeriesBadgePalette = {
  [key in SeriesResult]: PaletteColor
}

export const seriesBadgeLight: SeriesBadgePalette = {
  [SeriesResult.Win]: { light: '#81c784', main: '#43a047', dark: '#2e7d32', contrastText: '#1b5e20' },
  [SeriesResult.Loss]: { light: '#e57373', main: '#e53935', dark: '#c62828', contrastText: '#b71c1c' },
  [SeriesResult.Tie]: { light: '#64b5f6', main: '#1e88e5', dark: '#1565c0', contrastText: '#0d47a1' },
  [SeriesResult.Sweep]: { light: '#ffe082', main: '#ffb300', dark: '#ff8f00', contrastText: '#5c3d00' },
  [SeriesResult.Swept]: { light: '#bcaaa4', main: '#8d6e63', dark: '#6d4c41', contrastText: '#3e2723' },
  [SeriesResult.InProgress]: { light: '#81d4fa', main: '#039be5', dark: '#0277bd', contrastText: '#01579b' },
  [SeriesResult.Unplayed]: { light: '#f5f5f5', main: '#9e9e9e', dark: '#757575', contrastText: '#424242' },
  [SeriesResult.WorldSeriesWin]: { light: '#ffd54f', main: '#e6a800', dark: '#c89200', contrastText: '#3e2700' },
}

export const seriesBadgeDark: SeriesBadgePalette = {
  [SeriesResult.Win]: { light: '#1a2e1a', main: '#2d4a2d', dark: '#3d5a3d', contrastText: '#b8d4b8' },
  [SeriesResult.Loss]: { light: '#2e1a1a', main: '#4a2d2d', dark: '#5a3d3d', contrastText: '#d4b8b8' },
  [SeriesResult.Tie]: { light: '#1a1a2e', main: '#2d2d4a', dark: '#3d3d5a', contrastText: '#b8b8d4' },
  [SeriesResult.Sweep]: { light: '#2e2810', main: '#4a4020', dark: '#5c5030', contrastText: '#e8d898' },
  [SeriesResult.Swept]: { light: '#2e1c1c', main: '#4a3032', dark: '#5c3e40', contrastText: '#d4b0b4' },
  [SeriesResult.InProgress]: { light: '#251a2e', main: '#3d2d4a', dark: '#4d3d5a', contrastText: '#c8b8d4' },
  [SeriesResult.Unplayed]: { light: '#424242', main: '#757575', dark: '#9e9e9e', contrastText: '#f5f5f5' },
  [SeriesResult.WorldSeriesWin]: { light: '#4a3600', main: '#9a7000', dark: '#c89200', contrastText: '#ffd700' },
}
