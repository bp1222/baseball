import { createContext, Dispatch, useReducer, PropsWithChildren } from "react";
import { MLBSeason, MLBTeam } from "./services/MlbApi";
import { Theme } from "@mui/material";
import { defaultTheme } from "./colors/phillies";

export type AppState = {
  team: MLBTeam;
  teams: MLBTeam[];

  season: MLBSeason;
  seasons: MLBSeason[];

  theme: Theme;
};

export enum AppStateAction {
  Team = "team",
  Teams = "teams",
  Season = "season",
  Seasons = "seasons",
  Theme = "theme",
}

type AppStateActions =
  | { type: AppStateAction.Team; team: MLBTeam }
  | { type: AppStateAction.Teams; teams: MLBTeam[] }
  | { type: AppStateAction.Season; season: MLBSeason }
  | { type: AppStateAction.Seasons; seasons: MLBSeason[] }
  | { type: AppStateAction.Theme; theme: Theme };

const initState: AppState = {
  team: {},
  teams: [],

  season: {},
  seasons: [],

  theme: defaultTheme,
};

export const AppStateContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppStateActions>;
}>({
  state: initState,
  dispatch: () => null,
});

function reducer(state: AppState, action: AppStateActions): AppState {
  switch (action.type) {
    case AppStateAction.Team:
      return {
        ...state,
        team: action.team,
      };
    case AppStateAction.Teams:
      return {
        ...state,
        teams: action.teams,
      };
    case AppStateAction.Season:
      return {
        ...state,
        season: action.season,
      };
    case AppStateAction.Seasons:
      return {
        ...state,
        seasons: action.seasons,
      };
    case AppStateAction.Theme:
      return {
        ...state,
        theme: action.theme,
      };
    default:
      return {
        ...state,
      };
  }
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}
