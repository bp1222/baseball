import { CssBaseline, ThemeProvider } from "@mui/material";
import { useContext, useEffect } from "react";
import { AppStateContext } from "../state/context";
import { Outlet, useParams } from "react-router-dom";
import GetTheme from "../colors";
import { AppStateAction } from "../state/actions";

const Team = () => {
  const { state, dispatch } = useContext(AppStateContext);
  const { teamId } = useParams();

  useEffect(() => {
    dispatch({
      type: AppStateAction.Team,
      team: state.teams.find((t) => t.id == teamId)!,
    });
  }, [dispatch, state.teams, teamId]);

  return (
    <ThemeProvider theme={GetTheme(state.team?.id)}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  );
};

export default Team;
