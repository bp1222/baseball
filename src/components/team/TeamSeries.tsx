import {Box, CircularProgress, Grid} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {Series} from "../../models/Series.ts";
import SeriesItem from "../series/SeriesItem.tsx";
import {useParams} from "react-router-dom";
import {AppStateContext} from "../../state/Context.tsx";
import {FindTeam} from "../../utils/findTeam.ts";

const TeamSeries = () => {
  const { state } = useContext(AppStateContext);
  const [series, setSeries] = useState<Series[]>([]);

  const {teamId} = useParams();

  const team = FindTeam(state.teams, parseInt(teamId ?? ""))

  useEffect(() => {
    if (state.seasonSeries == undefined || team == undefined) return
    setSeries(state.seasonSeries.filter((s) => s.games.some((g) => g.teams.away.team.id == team.id || g.teams.home.team.id == team.id)))
  }, [state.seasonSeries, team]);

  if ((series?.length ?? 0) == 0) {
    return (<Box display={"flex"} justifyContent={"center"}>
        <CircularProgress/>
      </Box>
    )
  }
  return (
    <Grid container flexWrap={"wrap"} columns={2}>
      {series.map((s) => (
        <Grid xs={1} padding={1} key={s.pk} item>
          <SeriesItem series={s} interested={team}/>
        </Grid>
      ))}
    </Grid>
  );
}

export default TeamSeries