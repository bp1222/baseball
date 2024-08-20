import { createContext, useReducer, PropsWithChildren } from "react";
import { AppState } from "./state";
import { AppStateAction, AppStateActions, AppStateDispatch } from "./actions";

const initState: AppState = {
  team: {},
  teams: [],

  season: {},
  seasons: [],
};

export const AppStateContext = createContext<{
  state: AppState;
  dispatch: AppStateDispatch;
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
