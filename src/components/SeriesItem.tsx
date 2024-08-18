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
      direction={"row"}
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: SeriesResultColor[series.result][300],
        backgroundColor: SeriesResultColor[series.result][50],
        fontSize: "small",
      }}
    >
      {resultBadge()}
      <Box alignContent={"center"} minWidth={"35%"}>
        <Stack direction="row">
          <Box paddingLeft={1} marginTop={0.5} alignContent={"center"}>
            <img src={againstImage} height={24} width={24} />
          </Box>
          <Box paddingLeft={0}>
            <Typography fontSize={"smaller"} noWrap>
              {series.homeaway == SeriesHomeAway.Home
                ? "vs "
                : SeriesHomeAway.Away
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
}

export default SeriesItem;
