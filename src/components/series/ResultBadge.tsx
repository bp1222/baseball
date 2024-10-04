import { Typography } from "@mui/material"

import { SeriesResult, SeriesType } from "../../models/Series.ts"
import {GetBadgeColors} from "./colors.ts"

type ResultBadgeProps = {
  result: SeriesResult
  type: SeriesType
}

export const ResultBadge = ({ result, type }: ResultBadgeProps) => {
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

  const { background, border } = GetBadgeColors(type, result)

  if (badge.length > 0) {
    return (
      <Typography
        minWidth={45}
        maxWidth={45}
        height={11}
        bgcolor={background}
        color={"Background"}
        fontSize={"smaller"}
        lineHeight={1}
        letterSpacing={-0.5}
        textAlign={"center"}
        border={2}
        borderRadius={2}
        borderColor={border}
      >
        {badge.toUpperCase()}
      </Typography>
    )
  }
}
