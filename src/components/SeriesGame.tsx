import { Box, Stack } from "@mui/material";
import { GameResultColor, GameResult } from "../models/Series";
import { MLBGame, MLBTeam } from "../services/MlbApi";

type SeriesGameProps = {
  result: GameResult;
  game: MLBGame;
  home: MLBTeam;
  away: MLBTeam;
};

function SeriesGame({ result, game, home, away }: SeriesGameProps) {
  const getDay = (date: string | undefined): string => {
    return new Date(date ?? "")
      .toLocaleString("default", { month: "short", day: "numeric" })
      .toUpperCase();
  };

  const renderScore = (name: string | undefined, score: number | undefined) => {
    return (
      <Stack direction="row" sx={{ fontSize: "smaller", textAlign: "center" }}>
        <Box
          sx={{
            borderRight: 0.2,
            borderBottom: 0.2,
            borderColor: GameResultColor[result][100],
            color: GameResultColor[result][700],
            fontWeight: "bold",
            width: "70%",
            paddingTop: 0.1,
          }}
        >
          {name}
        </Box>
        <Box
          sx={{
            borderBottom: 0.2,
            borderColor: GameResultColor[result][100],
            width: "30%",
            color: GameResultColor[result][700],
            fontWeight: "bold",
            paddingTop: 0.1,
          }}
        >
          {score}
        </Box>
      </Stack>
    );
  };

  return (
    <Stack
      direction="column"
      marginTop={0.5}
      marginBottom={0.5}
      marginRight={1}
      sx={{
        border: 1,
        borderRadius: 0.5,
        borderColor: GameResultColor[result][200],
        backgroundColor: GameResultColor[result][50],
        minWidth: "15%",
      }}
    >
      <Box
        textAlign={"center"}
        sx={{
          backgroundColor: GameResultColor[result][300],
          color: "Background",
          paddingLeft: 0.2,
          paddingRight: 0.2,
          width: 50,
          textAlign: "center",
        }}
      >
        {getDay(game.officialDate)}
      </Box>
      {renderScore(away?.abbreviation, game.teams?.away?.score)}
      {renderScore(home?.abbreviation, game.teams?.home?.score)}
    </Stack>
  );
}

export default SeriesGame;
