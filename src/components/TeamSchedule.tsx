import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import GenerateSeries, { Series } from "../models/Series";
import SeriesItem from "./SeriesItem";
import { MLBSchedule, MLBTeam } from "../services/MlbApi";
import { useOutletContext } from "react-router-dom";

type TeamScheduleProps = {
  schedule: MLBSchedule;
  team: MLBTeam;
};

const TeamSchedule = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const { schedule, team } = useOutletContext<TeamScheduleProps>();

  useEffect(() => {
    setSeries(GenerateSeries(schedule, team));
  }, [schedule, team]);

  if (series?.length > 0) {
    const pivot = Math.ceil(series!.length / 2);
    const [firstHalf, secondHalf] = [
      series?.slice(0, pivot),
      series?.slice(pivot, series?.length),
    ];
    return (
      <Grid
        container
        paddingTop={1}
        columnSpacing={2}
        columns={{ xs: 6, sm: 12 }}
      >
        <Grid item xs={6}>
          <Stack direction={"column"} spacing={1}>
            {firstHalf?.map((s) => <SeriesItem key={s.startDate} series={s} />)}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction={"column"} spacing={1}>
            {secondHalf?.map((s) => (
              <SeriesItem key={s.startDate} series={s} />
            ))}
          </Stack>
        </Grid>
      </Grid>
    );
  }

  console.log("HERE")
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    </>
  );
};

export default TeamSchedule;
