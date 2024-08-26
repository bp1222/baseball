import { useCallback, useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { AppStateContext } from "./state/Context";
import Header from "./components/Header";
import GetTheme from "./colors";
import { AppStateAction } from "./state/Actions";
import { MlbApi } from "./services/MlbApi";
import Footer from "./components/Footer";

const api = new MlbApi();

const App = () => {
  const { state, dispatch } = useContext(AppStateContext);
  const { seasonId, teamId } = useParams();
  const team = state.teams.find((t) => t.id == parseInt(teamId!));
  const navigate = useNavigate();

  const loadSeasonsState = useCallback(async () => {
    if (state.seasons.length > 0) return;

    const seasons = await api.getAllSeasons({ sportId: 1 });

    if (seasonId == undefined) {
      navigate("" + new Date().getFullYear());
    }

    dispatch({
      type: AppStateAction.Seasons,
      seasons:
        seasons.seasons
          ?.filter((s) => parseInt(s.seasonId!) > 1921)
          .reverse() ?? [],
    });
  }, [dispatch, navigate, seasonId, state.seasons]);

  const loadTeamsState = useCallback(async () => {
    if (seasonId == undefined) return;
    const teams = await api.getTeams({
      sportId: 1,
      leagueIds: [103, 104],
      season: seasonId,
    });

    dispatch({
      type: AppStateAction.Teams,
      teams: teams.teams!.sort((a, b) => a.name?.localeCompare(b.name!) ?? 0),
    });
  }, [dispatch, seasonId]);

  useEffect(() => {
    loadSeasonsState();
    loadTeamsState();
  }, [dispatch, loadSeasonsState, loadTeamsState]);

  return (
    <ThemeProvider theme={GetTheme(team?.id)}>
      <CssBaseline />
      <Header />
      <Outlet />
      <Footer />
    </ThemeProvider>
  );
};

export default App;
