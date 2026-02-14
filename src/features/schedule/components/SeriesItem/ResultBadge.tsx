import { Chip } from "@mui/material"

import { GetBadgeColors } from "@/colors"
import { SeriesResult } from "@/types/Series/SeriesResult"
import { SeriesType } from "@/types/Series/SeriesType"

type ResultBadgeProps = {
  result: SeriesResult
  type: SeriesType
}

const RESULT_LABELS: Record<SeriesResult, string> = {
  [SeriesResult.Win]: "Win",
  [SeriesResult.Loss]: "Loss",
  [SeriesResult.Sweep]: "Sweep",
  [SeriesResult.Swept]: "Swept",
  [SeriesResult.Tie]: "Tie",
  [SeriesResult.InProgress]: "In progress",
  [SeriesResult.Unplayed]: "",
}

export const ResultBadge = ({ result, type }: ResultBadgeProps) => {
  const label = RESULT_LABELS[result]
  if (!label) return null

  const { background, border } = GetBadgeColors(type, result)

  return (
    <Chip
      label={label}
      size="small"
      variant="filled"
      sx={{
        height: 22,
        fontSize: "0.7rem",
        fontWeight: 600,
        borderRadius: 0.5,
        bgcolor: background,
        color: "grey.900",
        border: "1px solid",
        borderColor: border,
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  )
}
