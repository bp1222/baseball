import { Box, Stack } from "@mui/material";
import { ResultColor, SeriesGame as SG } from "../models/Series";
import { Team } from "../services/client-api";

type SeriesGameProps = {
  sg: SG;
  home: Team | undefined;
  away: Team | undefined;
};

function SeriesGame({ sg, home, away }: SeriesGameProps) {
  const getDay = (date: string | undefined): string => {
    const d = new Date(date ?? "");
    return d
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
            borderColor: ResultColor[sg.result][100],
            color: ResultColor[sg.result][700],
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
            borderColor: ResultColor[sg.result][100],
            width: "30%",
            color: ResultColor[sg.result][700],
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
        borderColor: ResultColor[sg.result][200],
        backgroundColor: ResultColor[sg.result][50],
        minWidth: "15%",
      }}
    >
      <Box
        textAlign={"center"}
        sx={{
          backgroundColor: ResultColor[sg.result][300],
          color: "Background",
          paddingLeft: 0.2,
          paddingRight: 0.2,
          width: 50,
          textAlign: "center",
        }}
      >
        {getDay(sg.game.officialDate)}
      </Box>
      {renderScore(away?.abbreviation, sg.game.teams?.away?.score)}
      {renderScore(home?.abbreviation, sg.game.teams?.home?.score)}
    </Stack>
  );
}

export default SeriesGame;
