import { Box, Stack } from "@mui/material";
import { GameResultColor, GameResult, SeriesType } from "../models/Series";
import { MLBGame, MLBTeam } from "../services/MlbApi";

type SeriesGameProps = {
  result: GameResult;
  game: MLBGame;
  home: MLBTeam;
  away: MLBTeam;
};

function SeriesGame({ result, game, home, away }: SeriesGameProps) {
  const getDay = (): string => {
    return new Date(game.officialDate ?? "")
      .toLocaleString("us", { month: "short", day: "numeric", timeZone: "utc" })
      .toUpperCase();
  };

  const renderScore = (name: string | undefined, score: number | undefined) => {
    return (
      <Stack direction="row" sx={{ fontSize: "smaller", textAlign: "center" }}>
        <Box
          sx={{
            borderRight: 1,
            borderBottom: 1,
            borderColor: GameResultColor[result][100],
            color: GameResultColor[result][700],
            width: "70%",
            paddingTop: 0.1,
          }}
        >
          {name}
        </Box>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: GameResultColor[result][100],
            width: "30%",
            color: GameResultColor[result][700],
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
        fontSize: "smaller",
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
        {getDay()}
      </Box>
      {renderScore(away?.abbreviation, game.teams?.away?.score)}
      {renderScore(home?.abbreviation, game.teams?.home?.score)}
    </Stack>
  );
}

export default SeriesGame;
