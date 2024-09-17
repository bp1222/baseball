import { Box, CircularProgress, Grid } from "@mui/material";
import {useContext, useEffect, useState} from "react";
import GenerateSeries, { Series } from "../models/Series";
import SeriesItem from "./SeriesItem";
import {useParams} from "react-router-dom";
import {AppStateContext} from "../state/Context.tsx";

const TeamSchedule = () => {
  const { state } = useContext(AppStateContext);
  const [series, setSeries] = useState<Series[]>([]);

  const {teamId} = useParams();

  const team = state.teams?.find((t) => t.id == parseInt(teamId ?? ""));

  useEffect(() => {
    if (state.seasonSchedule== undefined || team == undefined) return
    const teamGames = state.seasonSchedule.dates.flatMap((d) => d.games).filter((g) => g.teams.away.team.id == team.id || g.teams.home.team.id == team.id)
    setSeries(GenerateSeries(teamGames, team))
  }, [state.seasonSchedule, team]);

  if ((series?.length ?? 0) == 0) {
    return (<Box display={"flex"} justifyContent={"center"}>
        <CircularProgress/>
      </Box>
    )
  }
  return (
    <Grid container display={"flex"} flexWrap={"wrap"} columns={2} columnSpacing={4} >
      {series.map((s) => <Grid xs={1} padding={1} key={s.seriesNumber} item><SeriesItem series={s} /></Grid>)}
    </Grid>
  );
};

export default TeamSchedule;
