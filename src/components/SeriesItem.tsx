import { Box, Stack, Typography } from "@mui/material";
import {
  Series,
  SeriesHomeAway,
  SeriesResultColor,
  SeriesResult,
  SeriesType,
} from "../models/Series";
import { useContext } from "react";
import { AppStateContext } from "../state/context";
import { MLBTeam } from "../services/MlbApi/models";
import SeriesGame from "./SeriesGame";
import { amber, blueGrey } from "@mui/material/colors";

type SeriesItemProps = {
  series: Series;
};

const SeriesItem = ({ series }: SeriesItemProps) => {
  const { state } = useContext(AppStateContext);

  const findTeam = (id: number | undefined): MLBTeam | undefined => {
    return state.teams.find((t) => t.id == id);
  };

  const againstImage =
    "https://www.mlbstatic.com/team-logos/team-cap-on-light/" +
    series.against?.team?.id +
    ".svg";
  const againstTeam = findTeam(series.against?.team?.id);

  const resultBadge = () => {
    let badge = "";
    switch (series.result) {
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
      series.type == SeriesType.World && series.result == SeriesResult.Win
        ? amber[700]
        : SeriesResultColor[series.result][500];
    const badgeBackgroundColor =
      series.type == SeriesType.World && series.result == SeriesResult.Win
        ? amber[400]
        : SeriesResultColor[series.result][300];

    if (badge.length > 0) {
      return (
        <Box
          minWidth={45}
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

  const specialBadge = () => {
    let badge = "";
    switch (series.type) {
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
          sx={{
            backgroundColor: blueGrey[300],
            border: 2,
            borderRadius: 2,
            borderColor: blueGrey[500],
            height: 11,
            marginLeft: 1,
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

  const getClubName = (name: string | undefined): string | undefined => {
    if (name == "Diamondbacks") {
      return "D-Backs";
    }
    return name;
  };

  const seriesBorderColor =
    series.type == SeriesType.World && series.result == SeriesResult.Win
      ? amber[600]
      : SeriesResultColor[series.result][300];
  const seriesBackgroundColor =
    series.type == SeriesType.World && series.result == SeriesResult.Win
      ? amber[300]
      : SeriesResultColor[series.result][50];

  return (
    <Stack
      direction={"row"}
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: seriesBorderColor,
        backgroundColor: seriesBackgroundColor,
        fontSize: "small",
      }}
    >
      <Stack
        position="absolute"
        direction="row"
        display={"flex"}
        mt={-0.8}
        ml={-1.5}
        padding="10"
      >
        {resultBadge()}
        {specialBadge()}
      </Stack>
      <Box alignContent={"center"} minWidth={{ xs: "40%", md: "35%" }}>
        <Stack direction="row">
          <Box paddingLeft={1} marginTop={0.5} alignContent={"center"}>
            <img src={againstImage} height={24} width={24} />
          </Box>
          <Box paddingLeft={0}>
            <Typography fontSize={"smaller"} noWrap>
              {series.homeaway == SeriesHomeAway.Home
                ? "vs "
                : series.homeaway == SeriesHomeAway.Away
                  ? "@ "
                  : "against "}
              {againstTeam?.franchiseName}
            </Typography>
            <Typography
              noWrap
              fontSize={"Larger"}
              fontStyle={"bold"}
              textOverflow={"clip"}
            >
              {getClubName(againstTeam?.clubName)?.toUpperCase()}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box width={"fill-available"}>
        <Stack direction="row" justifyContent={"right"} flexWrap={"wrap"}>
          {series.games.map((sg) => (
            <SeriesGame
              key={sg.game.gameGuid}
              result={sg.result}
              game={sg.game}
              home={findTeam(sg.game.teams?.home?.team?.id)!}
              away={findTeam(sg.game.teams?.away?.team?.id)!}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default SeriesItem;
