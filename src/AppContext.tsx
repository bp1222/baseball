import { createContext, Dispatch, useReducer, PropsWithChildren } from "react";
import { MLBSeason, MLBTeam } from "./services/MlbApi";

export type AppState = {
  team: MLBTeam;
  teams: MLBTeam[];

  season: MLBSeason;
  seasons: MLBSeason[];
};

export enum AppStateAction {
  Team = "team",
  Teams = "teams",
  Season = "season",
  Seasons = "seasons",
}

type AppStateActions =
  | { type: AppStateAction.Team; team: MLBTeam }
  | { type: AppStateAction.Teams; teams: MLBTeam[] }
  | { type: AppStateAction.Season; season: MLBSeason }
  | { type: AppStateAction.Seasons; seasons: MLBSeason[] };

const initState: AppState = {
  team: {},
  teams: [],

  season: {},
  seasons: [],
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
