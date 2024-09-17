import { Box, CircularProgress } from "@mui/material";
import {MlbApi, MLBSchedule} from "@bp1222/stats-api";
import {useEffect, useState} from "react";


const CurrentSeries = () => {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <CircularProgress />
    </Box>
  );
};

export default CurrentSeries;
