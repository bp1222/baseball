import { createContext, Dispatch, useReducer, PropsWithChildren } from "react";
import { Schedule, Season, Team } from "./services/client-api";

export type AppState = {
  team: Team;
  teams: Team[];
  season: Season;
  seasons: Season[];
  schedule: Schedule;
};

export enum AppStateAction {
  Team = "team",
  Teams = "teams",
  Season = "season",
  Seasons = "seasons",
  Schedule = "schedule",
}

type AppStateActions =
  | { type: AppStateAction.Team; team: Team }
  | { type: AppStateAction.Teams; teams: Team[] }
  | { type: AppStateAction.Season; season: Season }
  | { type: AppStateAction.Seasons; seasons: Season[] }
  | { type: AppStateAction.Schedule; schedule: Schedule };

const initState: AppState = {
  team: {},
  teams: [],
  season: {},
  seasons: [],
  schedule: {},
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
    case AppStateAction.Schedule:
      return {
        ...state,
        schedule: action.schedule,
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
