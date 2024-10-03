import { Typography } from "@mui/material"
import { blueGrey } from "@mui/material/colors"
import { SeriesType } from "../../models/Series.ts"

type SeriesBadgeProps = {
  type: SeriesType
}

export const SeriesBadge = ({ type }: SeriesBadgeProps) => {
  let badge = ""
  switch (type) {
    case SeriesType.WildCard:
      badge = "Wild Card"
      break
    case SeriesType.Division:
      badge = "Divisional"
      break
    case SeriesType.League:
      badge = "Championship"
      break
    case SeriesType.World:
      badge = "World Series"
      break
  }

  if (badge.length > 0) {
    return (
        <Typography
          minWidth={87}
          maxWidth={87}
          height={11}
          color={"Background"}
          bgcolor={blueGrey[300]}
          fontSize={"smaller"}
          lineHeight={1}
          letterSpacing={-0.5}
          textAlign={"center"}
          border={2}
          borderRadius={2}
          borderColor={blueGrey[500]}
          marginLeft={3}
          noWrap
        >
          {badge.toUpperCase()}
        </Typography>
    )
  }
}
