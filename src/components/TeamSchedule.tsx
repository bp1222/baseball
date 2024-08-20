import { CssBaseline, Grid, Stack, ThemeProvider } from "@mui/material";
import { MlbApi } from "../services/MlbApi";
import { useEffect, useCallback, useContext, useState } from "react";
import { AppStateContext } from "../state/context";
import GenerateSeries, { Series } from "../models/Series";
import SeriesItem from "./SeriesItem";
import { useParams } from "react-router-dom";
import GetTheme from "../colors";

const api = new MlbApi();

const TeamSchedule = () => {
  const { state } = useContext(AppStateContext);
  const [series, setSeries] = useState<Series[]>([]);
  const { seasonId, teamId } = useParams();

  const season = state.seasons.find((s) => s.seasonId == seasonId);
  const team = state.teams.find((t) => t.id == parseInt(teamId ?? ""));

  const getSchedule = useCallback(async () => {
    if (team == undefined) return;
    if (season == undefined) return;

    const schedule = await api.getSchedule({
      sportId: 1,
      teamId: team.id,
      startDate: season.springStartDate ?? season.preSeasonStartDate,
      endDate: season.postSeasonEndDate,
    });

    setSeries(GenerateSeries(schedule, team));
  }, [season, team]);

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
      <ThemeProvider theme={GetTheme(team?.id)}>
        <CssBaseline />
        <Grid
          container
          paddingTop={1}
          columnSpacing={2}
          columns={{ xs: 6, sm: 12 }}
        >
          <Grid item xs={6}>
            <Stack direction={"column"} spacing={1}>
              {firstHalf?.map((s) => (
                <SeriesItem key={s.startDate} series={s} />
              ))}
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
      </ThemeProvider>
    );
  }
  return <>Loading</>;
};

export default TeamSchedule;
