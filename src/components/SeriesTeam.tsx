import { Box, Stack, Typography } from "@mui/material";
import { MLBTeam } from "@bp1222/stats-api";
import { SeriesHomeAway } from "../models/Series";

type SeriesTeamProps = {
  interested?: MLBTeam;
  against: MLBTeam;
  homeaway: SeriesHomeAway;
};

const SeriesTeam = ({ interested, against, homeaway }: SeriesTeamProps) => {
  const getImage = (id: number) =>
    "https://www.mlbstatic.com/team-logos/team-cap-on-light/" + id + ".svg";

  const getClubName = (name: string | undefined): string | undefined => {
    if (name == "Diamondbacks") {
      return "D-Backs";
    }
    return name;
  };

  if (interested) {
    return (
      <Stack direction={{xs: "column", sm: "row"}}>
        <Box paddingLeft={1} marginTop={0.5} alignContent={"center"}>
          <img src={getImage(against.id)} height={24} width={24}/>
        </Box>
        <Box paddingLeft={1} alignContent={"center"}>
          <Typography fontSize={"larger"} fontWeight={"bold"} overflow={'visible'}>
            {homeaway == SeriesHomeAway.Split
              ? " against "
              : " @ "}
          </Typography>
        </Box>
        <Box paddingLeft={1} marginTop={0.5} alignContent={"center"}>
          <img src={getImage(interested.id)} height={24} width={24}/>
        </Box>
      </Stack>
    )
  } else {
    return (
      <Stack direction={{xs: "column", sm: "row"}}>
        <Box paddingLeft={1} marginTop={0.5} alignContent={"center"}>
          <img src={getImage(against.id)} height={24} width={24}/>
        </Box>
        <Box paddingLeft={{xs: 1, sm: 0}}>
          <Typography fontSize={"smaller"} overflow={'visible'}>
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
  }
};

export default SeriesTeam;
