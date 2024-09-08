import { Box, CircularProgress, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import GenerateSeries, { Series } from "../models/Series";
import SeriesItem from "./SeriesItem";
import { MLBSchedule, MLBTeam } from "@bp1222/stats-api";
import { useOutletContext } from "react-router-dom";

type TeamScheduleProps = {
  schedule: MLBSchedule;
  team: MLBTeam;
};

const TeamSchedule = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const { schedule, team } = useOutletContext<TeamScheduleProps>();

  useEffect(() => {
    if (schedule == undefined || team == undefined) return
    setSeries(GenerateSeries(schedule, team));
  }, [schedule, team]);

  if (series?.length > 0) {
    return (
      <Grid container display={"flex"} flexWrap={"wrap"} columns={2} columnSpacing={4} >
          {series.map((s) => <Grid xs={1} padding={1} key={s.startDate} item><SeriesItem series={s} /></Grid>)}
      </Grid>
    );
  }
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <CircularProgress />
    </Box>
  );
};

export default TeamSchedule;
