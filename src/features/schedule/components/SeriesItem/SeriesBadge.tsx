import {Typography} from "@mui/material"
import {blueGrey} from "@mui/material/colors"

import {SeriesType} from "@/types/Series/SeriesType.ts"

type SeriesBadgeProps = {
  type: SeriesType
}

export const SeriesBadge = ({type}: SeriesBadgeProps) => {
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
        sx={{ maxWidth: "100%", width: 100, lineHeight: 1, boxSizing: "border-box" }}
        color="Background"
        bgcolor={blueGrey[300]}
        fontSize="smaller"
        textAlign="center"
        border={2}
        borderRadius={1}
        borderColor={blueGrey[500]}
        marginTop={0.5}
      >
        {badge.toUpperCase()}
      </Typography>
    )
  }
}
