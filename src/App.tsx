import {MlbApi} from "@bp1222/stats-api";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {Outlet, useNavigate, useParams} from "react-router-dom";

import Header from "./components/Header";
import GetTheme from "./colors";
import Footer from "./components/Footer";
import {useContext, useEffect} from "react";
import {AppStateAction} from "./state/Actions.ts";
import {AppStateContext} from "./state/Context.tsx";

const mlbApi = new MlbApi();

const App = () => {
  const {state, dispatch} = useContext(AppStateContext);
  const {seasonId, teamId} = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    mlbApi.getAllSeasons({sportId: 1}).then((seasons) => {
      dispatch({
        type: AppStateAction.Seasons,
        seasons:
          seasons.seasons
            ?.filter((s) => parseInt(s.seasonId!) > 1921)
            .reverse() ?? [],
      })

      if (seasonId == undefined) {
        navigate("/" + new Date().getFullYear())
        return
      }
    })
  }, [dispatch, navigate]);

  useEffect(() => {
    if (seasonId == null)
      return;

    mlbApi.getTeams({
      sportId: 1,
      leagueIds: [103, 104],
      season: seasonId,
    }).then((teams) => {
      dispatch({
        type: AppStateAction.Teams,
        teams: teams.teams!.sort((a, b) => a.name?.localeCompare(b.name!) ?? 0),
      })
    })
  }, [dispatch, seasonId]);

  if (state.seasons == undefined || state.teams == undefined) {
    return <div>Loading...</div>
  }

  return (
    <ThemeProvider theme={GetTheme(parseInt(teamId ?? '0'))}>
      <CssBaseline/>
      <Header/>
      <Outlet />
      <Footer/>
    </ThemeProvider>
  );
};

export default App;
