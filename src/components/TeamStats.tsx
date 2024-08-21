import { Box, Stack } from "@mui/material";
import Standings from "./Standings";

const TeamStats = () => {
  return (
    <Stack direction={"column"}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Standings />
      </Box>
    </Stack>
  );
};

export default TeamStats;
