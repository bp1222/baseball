import { Box, Stack } from "@mui/material";
import DivisionStandings from "./DivisionStandings";
import TeamRanking from "./TeamRanking";

const TeamStats = () => {
  return (
    <Stack width={1} height={1} direction={"column"}>
      <Box>
        <DivisionStandings />
      </Box>
      <Box paddingTop={3}>
        <TeamRanking />
      </Box>
    </Stack>
  );
};

export default TeamStats;
