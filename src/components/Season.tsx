import {useContext, useEffect} from "react";
import {MlbApi} from "@bp1222/stats-api";
import {Outlet, useParams} from "react-router-dom";
import {AppStateContext} from "../state/Context.tsx";
import {AppStateAction} from "../state/Actions.ts";

const mlbApi = new MlbApi();

const Season = () => {
  const { state, dispatch } = useContext(AppStateContext);
  const { seasonId } = useParams();
  const season = state.seasons?.find((s) => s.seasonId == seasonId);

  useEffect(() => {
    if (season == undefined) return;
    mlbApi.getSchedule({
      sportId: 1,
      startDate: season.seasonStartDate,
      endDate: season.postSeasonEndDate,
      fields: ["date","gamePk","dates","games","gameType","gameDate","officialDate","status","codedGameState","teams","away","home","score","team","name","id","isWinner","seriesNumber","gamesInSeries","seriesGameNumber","division","seriesNumber"]
    }).then((schedule) => {
      dispatch({
        type: AppStateAction.SeasonSchedule,
        schedule: schedule,
      })
    })
  }, [dispatch, season]);

  return (
    <Outlet />
  );
};

export default Season;
