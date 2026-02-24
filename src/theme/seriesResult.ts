import type { PaletteColor, PaletteMode } from '@mui/material'
import { amber, blue, brown, grey, lightGreen, pink, purple, red } from '@mui/material/colors'

import type { SpringLeague } from '@/types/Series'
import { SeriesResult } from '@/types/Series/SeriesResult'
import { SeriesType } from '@/types/Series/SeriesType'

const SpringTrainingLight: Record<SpringLeague, PaletteColor> = {
  grapefruit: { light: grey[200], main: pink[100], dark: pink[200], contrastText: grey[800] },
  cactus: { light: grey[200], main: lightGreen[300], dark: lightGreen[400], contrastText: grey[800] },
}

const SpringTrainingDark: Record<SpringLeague, PaletteColor> = {
  grapefruit: { light: grey[800], main: pink[900], dark: pink[800], contrastText: grey[100] },
  cactus: { light: grey[800], main: lightGreen[900], dark: lightGreen[800], contrastText: grey[100] },
}

const SeriesResultColorLight: Record<SeriesResult, PaletteColor> = {
  [SeriesResult.Win]: { light: lightGreen[50], main: lightGreen[300], dark: lightGreen[400], contrastText: lightGreen[900] },
  [SeriesResult.Loss]: { light: red[50], main: red[300], dark: red[400], contrastText: red[900] },
  [SeriesResult.Tie]: { light: blue[50], main: blue[300], dark: blue[400], contrastText: blue[900] },
  [SeriesResult.Sweep]: { light: amber[50], main: amber[300], dark: amber[400], contrastText: amber[900] },
  [SeriesResult.Swept]: { light: brown[50], main: brown[300], dark: brown[400], contrastText: brown[900] },
  [SeriesResult.InProgress]: { light: purple[50], main: purple[300], dark: purple[400], contrastText: purple[900] },
  [SeriesResult.Unplayed]: { light: grey[200], main: grey[400], dark: grey[500], contrastText: grey[800] },
}

const SeriesResultColorDark: Record<SeriesResult, PaletteColor> = {
  [SeriesResult.Win]: { light: '#1a2e1a', main: '#2d4a2d', dark: '#3d5a3d', contrastText: '#b8d4b8' },
  [SeriesResult.Loss]: { light: '#2e1a1a', main: '#4a2d2d', dark: '#5a3d3d', contrastText: '#d4b8b8' },
  [SeriesResult.Tie]: { light: '#1a1a2e', main: '#2d2d4a', dark: '#3d3d5a', contrastText: '#b8b8d4' },
  [SeriesResult.Sweep]: { light: '#2e2a1a', main: '#4a422d', dark: '#5a523d', contrastText: '#d4ceb8' },
  [SeriesResult.Swept]: { light: '#2e251a', main: '#4a3d2d', dark: '#5a4d3d', contrastText: '#d4c8b8' },
  [SeriesResult.InProgress]: { light: '#251a2e', main: '#3d2d4a', dark: '#4d3d5a', contrastText: '#c8b8d4' },
  [SeriesResult.Unplayed]: { light: grey[800], main: grey[600], dark: grey[500], contrastText: grey[100] },
}

export const GetSeriesColors = (
  type: SeriesType,
  result: SeriesResult,
  springLeague?: SpringLeague,
  mode: PaletteMode = 'light',
): PaletteColor => {
  const dark = mode === 'dark'
  if (type === SeriesType.SpringTraining) {
    return dark
      ? SpringTrainingDark[springLeague ?? 'grapefruit']
      : SpringTrainingLight[springLeague ?? 'grapefruit']
  }
  if (type === SeriesType.World && result === SeriesResult.Win) {
    return dark
      ? { light: '#2e2a1a', main: '#4a4230', dark: '#5a5240', contrastText: '#d4ceb8' }
      : { light: amber[200], main: amber[500], dark: amber[600], contrastText: amber[900] }
  }
  return dark ? SeriesResultColorDark[result] : SeriesResultColorLight[result]
}
