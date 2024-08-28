import { Box, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { SeriesType } from "../models/Series";

type SeriesBadgeProps = {
  type: SeriesType;
};

const SeriesBadge = ({ type }: SeriesBadgeProps) => {
  let badge = "";
  switch (type) {
    case SeriesType.WildCard:
      badge = "Wild Card";
      break;
    case SeriesType.Division:
      badge = "Divisional";
      break;
    case SeriesType.League:
      badge = "Championship";
      break;
    case SeriesType.World:
      badge = "World Series";
      break;
  }

  if (badge.length > 0) {
    return (
      <Box
        minWidth={90}
        maxWidth={90}
        sx={{
          backgroundColor: blueGrey[300],
          border: 2,
          borderRadius: 2,
          borderColor: blueGrey[500],
          height: 11,
          marginLeft: {xs: 0, sm: 1},
        }}
      >
        <Typography
          color={"Background"}
          fontSize={"smaller"}
          lineHeight={1}
          letterSpacing={-0.5}
          textAlign={"center"}
          noWrap
        >
          {badge.toUpperCase()}
        </Typography>
      </Box>
    );
  }
};

export default SeriesBadge;
