import { Grid, Stack } from "@mui/material";
import { MlbApi } from "../services/MlbApi";
import { useEffect, useCallback, useContext, useState } from "react";
import { AppStateAction, AppStateContext } from "../AppContext";
import GenerateSeries, { Series } from "../models/Series";
import SeriesItem from "./SeriesItem";
import { useParams } from "react-router-dom";

const api = new MlbApi();

function TeamSchedule() {
  const { state, dispatch } = useContext(AppStateContext);
  const [series, setSeries] = useState<Series[]>([]);

  const params = useParams() as { teamId: string };
  const teamId = parseInt(params.teamId);

  // Init state if passed in
  if (state.team?.id == undefined) {
    const idx = state.teams.findIndex((t) => t.id == teamId);
    dispatch({
      type: AppStateAction.Team,
      team: state.teams[idx],
    });
  }

  const getSchedule = useCallback(async () => {
    if (teamId == undefined) return;
    if (state.season.seasonId == undefined) return;

    const schedule = await api.getSchedule({
      sportId: 1,
      teamId: teamId,
      startDate: state.season.regularSeasonStartDate,
      endDate: state.season.regularSeasonEndDate,
    });

    setSeries(GenerateSeries(schedule, teamId));
  }, [state.season, teamId]);

  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  if (series?.length > 0) {
    const pivot = Math.ceil(series!.length / 2);
    const [firstHalf, secondHalf] = [
      series?.slice(0, pivot),
      series?.slice(pivot, series?.length),
    ];
    return (
      <Grid container paddingTop={1} columnSpacing={2}>
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
  return <></>;
}

export default TeamSchedule;
