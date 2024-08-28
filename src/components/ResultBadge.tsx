import { amber } from "@mui/material/colors";
import { SeriesResult, SeriesResultColor, SeriesType } from "../models/Series";
import { Box, Typography } from "@mui/material";

type ResultBadgeProps = {
  result: SeriesResult;
  type: SeriesType;
};

const ResultBadge = ({ result, type }: ResultBadgeProps) => {
  let badge = "";
  switch (result) {
    case SeriesResult.Win:
      badge = "win";
      break;
    case SeriesResult.Loss:
      badge = "loss";
      break;
    case SeriesResult.Sweep:
      badge = "sweep";
      break;
    case SeriesResult.Swept:
      badge = "swept";
      break;
    case SeriesResult.Tie:
      badge = "tie";
      break;
  }

  const badgeBorderColor =
    type == SeriesType.World && result == SeriesResult.Win
      ? amber[700]
      : SeriesResultColor[result][500];

  const badgeBackgroundColor =
    type == SeriesType.World && result == SeriesResult.Win
      ? amber[400]
      : SeriesResultColor[result][300];

  if (badge.length > 0) {
    return (
      <Box
        minWidth={45}
        maxWidth={45}
        sx={{
          backgroundColor: badgeBackgroundColor,
          height: 11,
          border: 2,
          borderRadius: 2,
          borderColor: badgeBorderColor,
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
    );
  }
};

export default ResultBadge;
