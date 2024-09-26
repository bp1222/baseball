import { createContext, useReducer, PropsWithChildren } from "react";
import { AppState } from "./State";
import { AppStateAction, AppStateActions, AppStateDispatch } from "./Actions";

export const AppStateContext = createContext<{
  state: AppState;
  dispatch: AppStateDispatch;
}>({
  state: {},
  dispatch: () => null,
});

function reducer(state: AppState, action: AppStateActions): AppState {
  switch (action.type) {
    case AppStateAction.Teams:
      return {
        ...state,
        teams: action.teams,
      };
    case AppStateAction.Seasons:
      return {
        ...state,
        seasons: action.seasons,
      };
    case AppStateAction.SeasonSeries:
      return {
        ...state,
        seasonSeries: action.series,
      };
    default:
      return {
        ...state,
      };
  }
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, {});

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}
