import {Season} from "@bp1222/stats-api"
import {ActionDispatch, PropsWithChildren, useMemo, useReducer} from "react"

import {Boxscore} from "@/types/Boxscore.ts"
import {Division} from "@/types/Division.ts"
import {UpdateGameFromBoxscore, UpdateGameFromLinescore} from "@/types/Game.ts"
import {League} from "@/types/League.ts"
import {Linescore} from "@/types/Linescore.ts"
import {Team} from "@/types/Team.ts"
import memoize from "@/utils/memoize.ts"

import {AppStateApiContext, AppStateContext, AppStateUtilContext} from "./context.ts"
import {AppState, AppStateAction, AppStateActions, AppStateApi, AppStateUtil} from "./types.ts"

const reducer = (state: AppState, action: AppStateActions): AppState => {
  switch (action.type) {
    case AppStateAction.Seasons:
      return {
        ...state,
        seasons: action.seasons,
      }
    case AppStateAction.League:
      return {
        ...state,
        leagues: action.leagues,
      }
    case AppStateAction.Divisions:
      return {
        ...state,
        divisions: action.divisions,
      }
    case AppStateAction.Teams:
      return {
        ...state,
        teams: action.teams,
      }
    case AppStateAction.Linescore:
      state.seasonSeries.forEach(s => s.games.map(g => g.pk == action.gameId ? UpdateGameFromLinescore(g, action.linescore) : g))
      return {
        ...state,
        seasonSeries: state.seasonSeries
      }
    case AppStateAction.Boxscore:
      state.seasonSeries.forEach(s => s.games.map(g => g.pk == action.gameId ? UpdateGameFromBoxscore(g, action.boxscore) : g))
      return {
        ...state,
        seasonSeries: state.seasonSeries
      }
    case AppStateAction.SeasonSeries:
      return {
        ...state,
        seasonSeries: action.series,
      }
  }
}

const appStateApi = (dispatch: ActionDispatch<[action: AppStateActions]>): AppStateApi => {
  const setSeasons = (seasons: AppState["seasons"]) => {
    dispatch({
      type: AppStateAction.Seasons,
      seasons
    })
  }
  const setLeagues = (leagues: AppState["leagues"]) => {
    dispatch({
      type: AppStateAction.League,
      leagues
    })
  }
  const setDivisions = (divisions: AppState["divisions"]) => {
    dispatch({
      type: AppStateAction.Divisions,
      divisions
    })
  }
  const setTeams = (teams: AppState["teams"]) => {
    dispatch({
      type: AppStateAction.Teams,
      teams
    })
  }
  const setSeasonSeries = (series: AppState["seasonSeries"]) => {
    dispatch({
      type: AppStateAction.SeasonSeries,
      series
    })
  }
  const setLinescore = (gameId: number, linescore: Linescore) => {
    dispatch({
      type: AppStateAction.Linescore,
      gameId,
      linescore
    })
  }
  const setBoxscore= (gameId: number, boxscore: Boxscore) => {
    dispatch({
      type: AppStateAction.Boxscore,
      gameId,
      boxscore
    })
  }
  return {setSeasons, setLeagues, setDivisions, setTeams, setSeasonSeries, setLinescore, setBoxscore}
}

const appStateUtil = (seasons: Season[], leagues: League[], divisions: Division[], teams: Team[]): AppStateUtil => {
  const getSeason = memoize((seasonId: string | number | undefined) => {
    if (seasonId == undefined) return
    if (seasons.length == 0) return

    const found = seasons.find((s) => s.seasonId == seasonId)
    if (!found) throw new Error(`Unable to find season with id ${seasonId}`)
    return found
  })

  const getLeague = memoize((leagueId: string | number | undefined) => {
    if (leagueId == undefined) return
    if (leagues.length == 0) return

    const found = leagues.find((l) => l.id == leagueId)
    if (!found) throw new Error(`Unable to find team with id ${leagueId}`)
    return found
  })

  const getDivision = memoize((divisionId: string | number | undefined) => {
    if (divisionId == undefined) return
    if (divisions.length == 0) return

    const found = divisions.find((d) => d.id == divisionId)
    if (!found) throw new Error(`Unable to find team with id ${divisionId}`)
    return found
  })

  const getTeam = memoize((teamId: string | number | undefined) => {
    if (teamId == undefined) return
    if (teams.length == 0) return

    const found = teams.find((t) => t.id == teamId)
    if (!found) throw new Error(`Unable to find team with id ${teamId}`)
    return found
  })

  return {getSeason, getLeague, getDivision, getTeam}
}

export function AppStateProvider({children}: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, {
    seasons: [],
    leagues: [],
    divisions: [],
    teams: [],
    seasonSeries: [],
  })

  const api: AppStateApi = useMemo(
    () => appStateApi(dispatch),
    [],
  )

  const util = useMemo(
    () => appStateUtil(state.seasons, state.leagues, state.divisions, state.teams),
    [state.seasons, state.leagues, state.divisions, state.teams]
  )

  return (
    <AppStateApiContext.Provider value={api}>
      <AppStateUtilContext.Provider value={util}>
        <AppStateContext.Provider value={state}>
          {children}
        </AppStateContext.Provider>
      </AppStateUtilContext.Provider>
    </AppStateApiContext.Provider>
  )
}
