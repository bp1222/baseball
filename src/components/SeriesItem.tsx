import { Box, Stack } from "@mui/material";
import {
  Series,
  SeriesResultColor,
  SeriesResult,
  SeriesType,
} from "../models/Series";
import { useContext } from "react";
import { AppStateContext } from "../state/Context";
import { MLBTeam } from "@bp1222/stats-api";
import SeriesGame from "./SeriesGame";
import {amber, grey} from "@mui/material/colors";
import ResultBadge from "./ResultBadge";
import SeriesBadge from "./SeriesBadge";
import SeriesTeam from "./SeriesTeam";

type SeriesItemProps = {
  series: Series
  interested?: MLBTeam
};

const SeriesItem = ({ series, interested }: SeriesItemProps) => {
  const { state } = useContext(AppStateContext);

  const findTeam = (id: number | undefined): MLBTeam | undefined => {
    return state.teams?.find((t) => t.id == id);
  };

  console.log(interested)

  const seriesBorderColor =
    interested != undefined ? grey[400] :
      series.type == SeriesType.World && series.result == SeriesResult.Win
        ? amber[600]
        : SeriesResultColor[series.result].border;

  const seriesBackgroundColor =
    interested != undefined ? grey[200] :
      series.type == SeriesType.World && series.result == SeriesResult.Win
        ? amber[300]
        : SeriesResultColor[series.result].background;

  console.log("HERE:" + interested)

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
      {interested == undefined ? (
        <Stack
          position="absolute"
          direction={{xs: "column", sm: "row"}}
          display={"flex"}
          mt={-0.8}
          ml={-1.5}
          padding="10"
        >
          <ResultBadge result={series.result} type={series.type} />
          <SeriesBadge type={series.type} />
        </Stack>
      ) : ''}
      <Box alignContent={"center"} minWidth={{ xs: "40%", md: "35%" }}>
        <SeriesTeam
          interested={findTeam(interested?.id)}
          against={findTeam(series.against?.team?.id)!}
          homeaway={series.homeaway}
        />
      </Box>

      <Stack
        direction="row"
        width={"fill-available"}
        justifyContent={"end"}
        alignContent={"center"}
        flexWrap={"wrap"}
      >
        {series.games.map((sg) => (
          <SeriesGame
            key={sg.game.gamePk}
            result={sg.result}
            game={sg.game}
            home={findTeam(sg.game.teams?.home?.team?.id)!}
            away={findTeam(sg.game.teams?.away?.team?.id)!}
            colorScores={interested == undefined}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default SeriesItem;
