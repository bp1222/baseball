import {AppStateAction, AppStateActions} from "./actions.ts"
import {AppState} from "./state.ts"

export const reducer = (state: AppState, action: AppStateActions): AppState => {
  switch (action.type) {
    case AppStateAction.Seasons:
      return {
        ...state,
        seasons: action.seasons,
      }
    case AppStateAction.Teams:
      return {
        ...state,
        teams: action.teams,
      }
    case AppStateAction.SeasonSeries:
      return {
        ...state,
        seasonSeries: action.series,
      }
    case AppStateAction.SelectedDate:
      return {
        ...state,
        selectedDate: action.selectedDate,
      }
    default:
      return {
        ...state,
      }
  }
}

