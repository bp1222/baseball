import type {PaletteColor, PaletteMode} from '@mui/material'
import {amber, blue, brown, grey, lightBlue, lightGreen, red} from '@mui/material/colors'

import {SeriesResult} from '@/types/Series/SeriesResult'
import {SeriesType} from '@/types/Series/SeriesType'

const BadgeResultColorLight: Record<SeriesResult, PaletteColor> = {
  [SeriesResult.Win]: { light: lightGreen[300], main: lightGreen[500], dark: lightGreen[600], contrastText: lightGreen[900] },
  [SeriesResult.Loss]: { light: red[300], main: red[500], dark: red[600], contrastText: red[900] },
  [SeriesResult.Tie]: { light: blue[300], main: blue[500], dark: blue[600], contrastText: blue[900] },
  [SeriesResult.Sweep]: { light: amber[300], main: amber[500], dark: amber[600], contrastText: amber[900] },
  [SeriesResult.Swept]: { light: brown[300], main: brown[500], dark: brown[600], contrastText: brown[900] },
  [SeriesResult.InProgress]: { light: lightBlue[300], main: lightBlue[500], dark: lightBlue[600], contrastText: lightBlue[900] },
  [SeriesResult.Unplayed]: { light: grey[100], main: grey[500], dark: grey[600], contrastText: grey[800] },
}

const BadgeResultColorDark: Record<SeriesResult, PaletteColor> = {
  [SeriesResult.Win]: { light: '#1a2e1a', main: '#2d4a2d', dark: '#3d5a3d', contrastText: '#b8d4b8' },
  [SeriesResult.Loss]: { light: '#2e1a1a', main: '#4a2d2d', dark: '#5a3d3d', contrastText: '#d4b8b8' },
  [SeriesResult.Tie]: { light: '#1a1a2e', main: '#2d2d4a', dark: '#3d3d5a', contrastText: '#b8b8d4' },
  [SeriesResult.Sweep]: { light: '#2e2a1a', main: '#4a422d', dark: '#5a523d', contrastText: '#d4ceb8' },
  [SeriesResult.Swept]: { light: '#2e251a', main: '#4a3d2d', dark: '#5a4d3d', contrastText: '#d4c8b8' },
  [SeriesResult.InProgress]: { light: '#251a2e', main: '#3d2d4a', dark: '#4d3d5a', contrastText: '#c8b8d4' },
  [SeriesResult.Unplayed]: { light: grey[800], main: grey[600], dark: grey[500], contrastText: grey[100] },
}

export const GetBadgeColors = (type: SeriesType, result: SeriesResult, mode: PaletteMode): PaletteColor => {
  const dark = mode === 'dark'
  if (type === SeriesType.World && result === SeriesResult.Win) {
    return dark
      ? { light: '#2e2a1a', main: '#4a4230', dark: '#5a5240', contrastText: '#d4ceb8' }
      : { light: amber[400], main: amber[700], dark: amber[800], contrastText: amber[900] }
  }
  return dark ? BadgeResultColorDark[result] : BadgeResultColorLight[result]
}
