import { Box, Stack, Typography } from "@mui/material";
import {
  Series,
  SeriesHomeAway,
  SeriesResultColor,
  SeriesResult,
} from "../models/Series";
import { useContext } from "react";
import { AppStateContext } from "../AppContext";
import { MLBTeam } from "../services/MlbApi/models";
import SeriesGame from "./SeriesGame";

type SeriesItemProps = {
  series: Series;
};

function SeriesItem({ series }: SeriesItemProps) {
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

    if (badge.length > 0) {
      return (
        <Box
          sx={{
            position: "absolute",
            backgroundColor: SeriesResultColor[series.result][300],
            border: 2,
            borderRadius: 2,
            borderColor: SeriesResultColor[series.result][500],
            height: 11,
            minWidth: 45,
            marginTop: -0.8,
            marginLeft: -1,
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

  const getClubName = (name: string | undefined): string | undefined => {
    if (name == "Diamondbacks") {
      return "D-Backs";
    }
    return name;
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{
        border: 1,
        borderColor: SeriesResultColor[series.result][300],
        borderRadius: 1,
        backgroundColor: SeriesResultColor[series.result][50],
        fontSize: "small",
      }}
    >
      {resultBadge()}
      <Box
        minWidth={"35%"}
        justifyItems={"left"}
        alignContent={"center"}
        alignItems={"left"}
        flexWrap={"wrap"}
      >
        <Stack paddingLeft={{ xs: 4.5 }} direction="row">
          <Box marginLeft={{ md: -2, xs: 0.5 }} alignContent={"center"}>
            <img src={againstImage} height={24} width={24} />
          </Box>
          <Box paddingLeft={0.3}>
            <Typography fontSize={"smaller"} noWrap>
              {series.homeaway == SeriesHomeAway.Home
                ? "vs"
                : SeriesHomeAway.Away
                  ? "@"
                  : "against"}{" "}
              {againstTeam?.franchiseName}
            </Typography>
            <Typography
              noWrap
              fontSize={"Larger"}
              fontStyle={"bold"}
              letterSpacing={0}
              textOverflow={"clip"}
            >
              {getClubName(againstTeam?.clubName)?.toUpperCase()}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box minWidth={"65%"}>
        <Stack
          direction="row"
          flexWrap={{ xs: "wrap", md: "inherit" }}
          paddingLeft={{ xs: 3 }}
          justifyContent={{ md: "right" }}
        >
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
}

export default SeriesItem;
