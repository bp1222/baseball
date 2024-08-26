import { Box, Stack, Typography } from "@mui/material";
import { MLBTeam } from "../services/MlbApi";
import { SeriesHomeAway } from "../models/Series";

type SeriesTeamProps = {
  against: MLBTeam;
  homeaway: SeriesHomeAway;
};

const SeriesTeam = ({ against, homeaway }: SeriesTeamProps) => {
  const againstImage =
    "https://www.mlbstatic.com/team-logos/team-cap-on-light/" +
    against.id +
    ".svg";

  const getClubName = (name: string | undefined): string | undefined => {
    if (name == "Diamondbacks") {
      return "D-Backs";
    }
    return name;
  };

  return (
    <Stack direction={{xs: "column", sm: "row"}}>
      <Box paddingLeft={1} marginTop={0.5} alignContent={"center"}>
        <img src={againstImage} height={24} width={24} />
      </Box>
      <Box paddingLeft={{xs: 1, sm: 0}}>
        <Typography fontSize={"smaller"} overflow={'visible'} noWrap>
          {homeaway == SeriesHomeAway.Home
            ? "vs "
            : homeaway == SeriesHomeAway.Away
              ? "@ "
              : "against "}
          {against.franchiseName}
        </Typography>
        <Typography
          noWrap
          overflow={'visible'}
          fontSize={{xs: "smaller", sm: "larger"}}
          fontStyle={"bold"}
          textOverflow={"clip"}
        >
          {getClubName(against.clubName)?.toUpperCase()}
        </Typography>
      </Box>
    </Stack>
  );
};

export default SeriesTeam;
