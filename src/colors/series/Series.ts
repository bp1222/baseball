import {amber, blue, brown, grey, lightGreen, purple, red} from "@mui/material/colors"

import {ResultColors} from "@/types/ResultColors"
import {SeriesResult, SeriesType} from "@/types/Series"

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

export const GetSeriesColors = (type: SeriesType, result: SeriesResult): ResultColors => {
  return type == SeriesType.World && result == SeriesResult.Win
    ? { background: amber[300], border: amber[600] }
    : SeriesResultColor[result]
}

export const DefaultSeriesResultColor = {
  background: grey[200],
  border: grey[400],
}
export const SeriesResultColor: { [key in SeriesResult]: ResultColors } = {
  [SeriesResult.Win]: {
    background: lightGreen[50],
    border: lightGreen[300],
  },
  [SeriesResult.Loss]: {
    background: red[50],
    border: red[300],
  },
  [SeriesResult.Tie]: {
    background: blue[50],
    border: blue[300],
  },
  [SeriesResult.Sweep]: {
    background: amber[50],
    border: amber[300],
  },
  [SeriesResult.Swept]: {
    background: brown[50],
    border: brown[300],
  },
  [SeriesResult.InProgress]: {
    background: purple[50],
    border: purple[300],
  },
  [SeriesResult.Unplayed]: DefaultSeriesResultColor
}
