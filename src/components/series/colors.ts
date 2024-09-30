import {GameResult, SeriesResult, SeriesType} from "../../models/Series.ts";
import {Color, darken} from "@mui/material";
import {
  amber,
  blue,
  brown,
  deepOrange,
  grey,
  lightBlue,
  lightGreen,
  orange,
  pink,
  purple,
  red
} from "@mui/material/colors";
import {getPickersOutlinedInputUtilityClass} from "@mui/x-date-pickers";

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

export const OppositeGameResult = (result: GameResult): GameResult => {
  switch (result) {
    case GameResult.Win:
      return GameResult.Loss
    case GameResult.Loss:
      return GameResult.Win
    default:
      return result
  }
}

export type ResultColors = {
  background: string,
  border: string,
}

export const GetSeriesColors = (type: SeriesType, result: SeriesResult): ResultColors => {
  return type == SeriesType.World && result == SeriesResult.Win
    ? { background: amber[300], border: amber[600] }
    : SeriesResultColor[result]
}

export const GetBadgeColors = (type: SeriesType, result: SeriesResult): ResultColors => {
  return type == SeriesType.World && result == SeriesResult.Win
    ? { background: amber[400], border: amber[700] }
    : BadgeResultColor[result]
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

export const DefaultGameResultColor = grey
export const GameResultColor: { [key in GameResult]: Color } = {
  [GameResult.Win]: lightGreen,
  [GameResult.Loss]: red,
  [GameResult.Tie]: blue,
  [GameResult.InProgress]: lightBlue,
  [GameResult.GameOver]: purple,
  [GameResult.Canceled]: deepOrange,
  [GameResult.Postponed]: orange,
  [GameResult.Unplayed]: DefaultGameResultColor,
}
