import { Box, Stack } from "@mui/material";
import { GameResultColor, GameResult } from "../models/Series";
import { MLBGame, MLBTeam } from "@bp1222/stats-api";
import {grey} from "@mui/material/colors";

type SeriesGameProps = {
  result: GameResult
  game: MLBGame
  home: MLBTeam
  away: MLBTeam
  colorScores?: boolean
};

const SeriesGame = ({ result, game, home, away, colorScores }: SeriesGameProps) => {
  const getDay = (): string => {
    return new Date(game.officialDate ?? "")
      .toLocaleString("us", { month: "short", day: "numeric", timeZone: "utc" })
      .toUpperCase();
  };

  const renderScore = (name: string | undefined, score: number | undefined) => {
    return (
      <Stack direction={"row"} sx={{ fontSize: "smaller", textAlign: "center" }}>
        <Box
          sx={{
            borderRight: 1,
            borderBottom: 1,
            borderColor: colorScores ? GameResultColor[result][100] : grey[300],
            color: colorScores ? GameResultColor[result][700] : grey[700],
            width: "70%",
            paddingTop: 0.1,
          }}
        >
          {name}
        </Box>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: colorScores ? GameResultColor[result][100] : grey[300],
            width: "30%",
            color: colorScores ? GameResultColor[result][700] : grey[700],
            paddingTop: 0.1,
          }}
        >
          {score??0}
        </Box>
      </Stack>
    );
  };

  return (
    <Stack
      direction={"column"}
      marginTop={0.5}
      marginBottom={0.5}
      marginRight={1}
      height={"fit-content"}
      sx={{
        border: 1,
        borderRadius: 0.5,
        borderColor: colorScores ? GameResultColor[result][200] : grey[400],
        backgroundColor: colorScores ? GameResultColor[result][50] : grey[100],
        minWidth: 50,
        fontSize: "smaller",
      }}
    >
      <Box
        textAlign={"center"}
        sx={{
          backgroundColor: colorScores ? GameResultColor[result][300] : grey[400],
          color: "Background",
          paddingLeft: 0.2,
          paddingRight: 0.2,
          textAlign: "center",
        }}
      >
        {getDay()}
      </Box>
      {renderScore(away?.abbreviation, game.teams?.away?.score)}
      {renderScore(home?.abbreviation, game.teams?.home?.score)}
    </Stack>
  );
};

export default SeriesGame;
