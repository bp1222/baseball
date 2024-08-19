import { useContext, useEffect } from "react";
import { MlbApi } from "./services/MlbApi";
import { Outlet, useLoaderData } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { AppStateAction, AppStateContext } from "./AppContext";
import Header from "./components/Header";
import GetTheme from "./colors";

const api = new MlbApi();

export const AppLoader = async () => {
  const seasons = await api.getAllSeasons({ sportId: 1 });
  const teams = await api.getTeams({ sportId: 1 });

  return {
    seasons: seasons,
    teams: teams,
  };
};

export type AppLoaderResponse = Awaited<ReturnType<typeof AppLoader>>;

function App() {
  const { state, dispatch } = useContext(AppStateContext);
  const { seasons, teams } = useLoaderData() as AppLoaderResponse;

  useEffect(() => {
    const curSeason = seasons.seasons?.find((s) =>
      s.seasonId == (new Date().getFullYear() as unknown as string) ? s : null,
    );
    if (curSeason) {
      dispatch({
        type: AppStateAction.Season,
        season: curSeason,
      });
    }

    dispatch({
      type: AppStateAction.Seasons,
      seasons: seasons.seasons?.reverse() ?? [],
    });

    dispatch({
      type: AppStateAction.Teams,
      teams: teams.teams?.sort((a, b) => a.name!.localeCompare(b.name!)) ?? [],
    });
  }, [seasons, teams, dispatch]);

  return (
    <ThemeProvider theme={GetTheme(state.team?.id)}>
      <CssBaseline />
      <Header />
      <Outlet />
    </ThemeProvider>
  );
}

export default App;
