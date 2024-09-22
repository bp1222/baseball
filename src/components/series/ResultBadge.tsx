import { amber } from "@mui/material/colors"
import { SeriesResult, SeriesType } from "../../models/Series.ts"
import { Box, Typography } from "@mui/material"
import {GetBadgeColors} from "./colors.ts";

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
      <Box
        minWidth={45}
        maxWidth={45}
        sx={{
          backgroundColor: background,
          height: 11,
          border: 2,
          borderRadius: 2,
          borderColor: border,
        }}
      >
        <Typography
          color={"Background"}
          fontSize={"smaller"}
          lineHeight={1}
          letterSpacing={-0.5}
          textAlign={"center"}
        >
          {badge.toUpperCase()}
        </Typography>
      </Box>
    )
  }
}
