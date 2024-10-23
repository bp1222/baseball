import {GameType, MlbApi} from "@bp1222/stats-api"
import {useContext, useEffect} from "react"
import {Outlet, useParams} from "react-router-dom"

import GenerateSeasonSeries from "../models/Series.ts"
import {AppStateAction} from "../state/Actions.ts"
import {AppStateContext} from "../state/Context.tsx"

const mlbApi = new MlbApi()

export const Component = () => {
  const { state, dispatch } = useContext(AppStateContext)
  const { seasonId } = useParams()
  const season = state.seasons?.find((s) => s.seasonId == seasonId)

  useEffect(() => {
    if (season == undefined) return
    mlbApi.getSchedule({
      sportId: 1,
      gameTypes: [GameType.Regular, GameType.WildCardSeries, GameType.DivisionSeries, GameType.LeagueChampionshipSeries, GameType.WorldSeries],
      startDate: season.regularSeasonStartDate,
      endDate: season.postSeasonEndDate ?? season.seasonEndDate,
      fields: ["date","gamePk","dates","games","gameType","gameDate",
        "officialDate","status","codedGameState","teams","away","home",
        "score","team","name","id","isWinner","seriesNumber",
        "gamesInSeries","seriesGameNumber","division","seriesNumber","league","link"],
      hydrate: "team(league)"
    }).then((schedule) => {
      dispatch({
        type: AppStateAction.SeasonSeries,
        series: GenerateSeasonSeries(schedule.dates.flatMap((d) => d.games))
      })
    })
  }, [dispatch, season])

  return (
    <Outlet />
  )
}