import {amber, blue, brown, grey, lightBlue, lightGreen, red} from "@mui/material/colors"

import {ResultColors} from "@/types/ResultColors.ts"
import {SeriesResult} from "@/types/Series/SeriesResult.ts"
import {SeriesType} from "@/types/Series/SeriesType.ts"

export const GetBadgeColors = (type: SeriesType, result: SeriesResult): ResultColors => {
  return type == SeriesType.World && result == SeriesResult.Win
    ? {background: amber[400], border: amber[700]}
    : BadgeResultColor[result]
}

export const DefaultBadgeResultColor = {
  background: grey[100],
  border: grey[500],
}

export const BadgeResultColor: { [key in SeriesResult]: ResultColors } = {
  [SeriesResult.Win]: {
    background: lightGreen[300],
    border: lightGreen[500]
  },
  [SeriesResult.Loss]: {
    background: red[300],
    border: red[500]
  },
  [SeriesResult.Tie]: {
    background: blue[300],
    border: blue[500]
  },
  [SeriesResult.Sweep]: {
    background: amber[300],
    border: amber[500]
  },
  [SeriesResult.Swept]: {
    background: brown[300],
    border: brown[500]
  },
  [SeriesResult.InProgress]: {
    background: lightBlue[300],
    border: lightBlue[500]
  },
  [SeriesResult.Unplayed]: DefaultBadgeResultColor
}

