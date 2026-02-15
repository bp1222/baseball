import {amber, blue, brown, grey, lightBlue, lightGreen, red} from "@mui/material/colors"

import type {ThemeMode} from "@/context/ThemeModeContext"
import {ResultColors} from "@/types/ResultColors"
import {SeriesResult} from "@/types/Series/SeriesResult"
import {SeriesType} from "@/types/Series/SeriesType"

/** Light-mode badge colors */
const BadgeResultColorLight: { [key in SeriesResult]: ResultColors } = {
  [SeriesResult.Win]: { background: lightGreen[300], border: lightGreen[500] },
  [SeriesResult.Loss]: { background: red[300], border: red[500] },
  [SeriesResult.Tie]: { background: blue[300], border: blue[500] },
  [SeriesResult.Sweep]: { background: amber[300], border: amber[500] },
  [SeriesResult.Swept]: { background: brown[300], border: brown[500] },
  [SeriesResult.InProgress]: { background: lightBlue[300], border: lightBlue[500] },
  [SeriesResult.Unplayed]: { background: grey[100], border: grey[500] },
}

/** Dark-mode: muted, low-brightness (same style as series cards) */
const BadgeResultColorDark: { [key in SeriesResult]: ResultColors } = {
  [SeriesResult.Win]: { background: "#1a2e1a", border: "#2d4a2d" },
  [SeriesResult.Loss]: { background: "#2e1a1a", border: "#4a2d2d" },
  [SeriesResult.Tie]: { background: "#1a1a2e", border: "#2d2d4a" },
  [SeriesResult.Sweep]: { background: "#2e2a1a", border: "#4a422d" },
  [SeriesResult.Swept]: { background: "#2e251a", border: "#4a3d2d" },
  [SeriesResult.InProgress]: { background: "#251a2e", border: "#3d2d4a" },
  [SeriesResult.Unplayed]: { background: grey[800], border: grey[600] },
}

export const GetBadgeColors = (
  type: SeriesType,
  result: SeriesResult,
  mode: ThemeMode = "light"
): ResultColors => {
  const dark = mode === "dark"
  if (type === SeriesType.World && result === SeriesResult.Win) {
    return dark
      ? { background: "#2e2a1a", border: "#4a4230" }
      : { background: amber[400], border: amber[700] }
  }
  return dark ? BadgeResultColorDark[result] : BadgeResultColorLight[result]
}

export const DefaultBadgeResultColor = { background: grey[100], border: grey[500] }
export const BadgeResultColor = BadgeResultColorLight

