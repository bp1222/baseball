import { Box, Stack } from "@mui/material";
import {
  Series,
  SeriesResultColor,
  SeriesResult,
  SeriesType,
} from "../models/Series";
import { useContext } from "react";
import { AppStateContext } from "../state/Context";
import { MLBTeam } from "../services/MlbApi/models";
import SeriesGame from "./SeriesGame";
import { amber } from "@mui/material/colors";
import ResultBadge from "./ResultBadge";
import SeriesBadge from "./SeriesBadge";
import SeriesTeam from "./SeriesTeam";

type SeriesItemProps = {
  series: Series;
};

const SeriesItem = ({ series }: SeriesItemProps) => {
  const { state } = useContext(AppStateContext);

  const findTeam = (id: number | undefined): MLBTeam | undefined => {
    return state.teams.find((t) => t.id == id);
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
      height={1}
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
        <ResultBadge result={series.result} type={series.type} />
        <SeriesBadge type={series.type} />
      </Stack>
      <Box alignContent={"center"} minWidth={{ xs: "40%", md: "35%" }}>
        <SeriesTeam
          against={findTeam(series.against?.team?.id)!}
          homeaway={series.homeaway}
        />
      </Box>

      <Stack
        direction="row"
        width={"fill-available"}
        justifyContent={"flex-end"}
        alignContent={"flex-start"}
        flexWrap={"wrap"}
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
    </Stack>
  );
};

export default SeriesItem;
