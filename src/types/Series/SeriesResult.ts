import { amber, blue, brown, grey, lightGreen, pink, purple, red } from '@mui/material/colors'

import type { ThemeMode } from '@/context/ThemeModeContext'
import { ResultColors } from '@/types/ResultColors.ts'
import type { SpringLeague } from '@/types/Series'
import { SeriesType } from '@/types/Series/SeriesType.ts'

export enum SeriesResult {
  Unplayed,
  InProgress,
  Tie,
  Win,
  Loss,
  Sweep,
  Swept,
}

export const OppositeSeriesResult = (result: SeriesResult): SeriesResult => {
  switch (result) {
    case SeriesResult.Win:
      return SeriesResult.Loss
    case SeriesResult.Loss:
      return SeriesResult.Win
    case SeriesResult.Sweep:
      return SeriesResult.Swept
    case SeriesResult.Swept:
      return SeriesResult.Sweep
    default:
      return result
  }
}

/** Spring training: default background, league border only */
const SpringTrainingBordersLight: { [K in SpringLeague]: ResultColors } = {
  grapefruit: { background: grey[200], border: pink[100] },
  cactus: { background: grey[200], border: lightGreen[300] },
}

/** Dark mode: muted borders (less bright than palette 700) */
const SpringTrainingBordersDark: { [K in SpringLeague]: ResultColors } = {
  grapefruit: { background: grey[800], border: '#6d3a4a' },
  cactus: { background: grey[800], border: '#3d5c3d' },
}

const DefaultSeriesResultColorLight = { background: grey[200], border: grey[400] }
const DefaultSeriesResultColorDark = { background: grey[800], border: grey[600] }

const SeriesResultColorLight: { [key in SeriesResult]: ResultColors } = {
  [SeriesResult.Win]: { background: lightGreen[50], border: lightGreen[300] },
  [SeriesResult.Loss]: { background: red[50], border: red[300] },
  [SeriesResult.Tie]: { background: blue[50], border: blue[300] },
  [SeriesResult.Sweep]: { background: amber[50], border: amber[300] },
  [SeriesResult.Swept]: { background: brown[50], border: brown[300] },
  [SeriesResult.InProgress]: { background: purple[50], border: purple[300] },
  [SeriesResult.Unplayed]: DefaultSeriesResultColorLight,
}

/** Dark mode: muted, low-brightness backgrounds and borders (tinted greys) */
const SeriesResultColorDark: { [key in SeriesResult]: ResultColors } = {
  [SeriesResult.Win]: { background: '#1a2e1a', border: '#2d4a2d' },
  [SeriesResult.Loss]: { background: '#2e1a1a', border: '#4a2d2d' },
  [SeriesResult.Tie]: { background: '#1a1a2e', border: '#2d2d4a' },
  [SeriesResult.Sweep]: { background: '#2e2a1a', border: '#4a422d' },
  [SeriesResult.Swept]: { background: '#2e251a', border: '#4a3d2d' },
  [SeriesResult.InProgress]: { background: '#251a2e', border: '#3d2d4a' },
  [SeriesResult.Unplayed]: DefaultSeriesResultColorDark,
}

export const GetSeriesColors = (
  type: SeriesType,
  result: SeriesResult,
  springLeague?: SpringLeague,
  mode: ThemeMode = 'light',
): ResultColors => {
  const dark = mode === 'dark'
  if (type === SeriesType.SpringTraining) {
    return dark
      ? SpringTrainingBordersDark[springLeague ?? 'grapefruit']
      : SpringTrainingBordersLight[springLeague ?? 'grapefruit']
  }
  if (type === SeriesType.World && result === SeriesResult.Win) {
    return dark ? { background: '#2e2a1a', border: '#4a4230' } : { background: amber[200], border: amber[500] }
  }
  return dark ? SeriesResultColorDark[result] : SeriesResultColorLight[result]
}

export const DefaultSeriesResultColor = DefaultSeriesResultColorLight
export const SeriesResultColor = SeriesResultColorLight
