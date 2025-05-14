import {Typography} from "@mui/material"

import {GetBadgeColors} from "@/colors"
import {SeriesResult} from "@/types/Series/SeriesResult.ts"
import {SeriesType} from "@/types/Series/SeriesType.ts"

type ResultBadgeProps = {
  result: SeriesResult
  type: SeriesType
}

export const ResultBadge = ({result, type}: ResultBadgeProps) => {
  let badge = ""
  switch (result) {
    case SeriesResult.Win:
      badge = "win"
      break
    case SeriesResult.Loss:
      badge = "loss"
      break
    case SeriesResult.Sweep:
      badge = "sweep"
      break
    case SeriesResult.Swept:
      badge = "swept"
      break
    case SeriesResult.Tie:
      badge = "tie"
      break
  }

  if (badge.length > 0) {
    const {background, border} = GetBadgeColors(type, result)
    return (
      <Typography
        width={47}
        bgcolor={background}
        color={"Background"}
        fontSize={"smaller"}
        textAlign={"center"}
        lineHeight={1.2}
        border={2}
        borderRadius={1}
        borderColor={border}>
        {badge.toUpperCase()}
      </Typography>
    )
  }
}
