import { Box, Stack, Typography } from "@mui/material";
import TeamRanking from "./TeamRanking";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppStateContext } from "../state/Context";
import { MlbApi, MLBRecord, MLBStandings, MLBStandingsList, MLBTeam } from "../services/MlbApi";
import { useParams } from "react-router-dom";
import LoadCachedData from "../services/caching";
import Standings from "./Standings";

const api = new MlbApi();

const TeamStats = () => {
  const { state } = useContext(AppStateContext);
  const [standings, setStandings] = useState<MLBStandings[]>([]);
  const { seasonId, teamId } = useParams();

  const team: MLBTeam = state.teams.find(
    (t) => t.id == parseInt(teamId ?? ""),
  )!;

  const getStandings = useCallback(async () => {
    if (team == undefined) return;
    if (seasonId == undefined) return;

    const seasonIdNum = parseInt(seasonId)
    const storageKey = "mlbStandings:" + seasonIdNum + ":" + team.id!

    const standings = await LoadCachedData<MLBStandingsList>(storageKey, (parseInt(seasonId) < (new Date().getFullYear())), () => api.getStandings({
      leagueId: team.league!.id!,
      season: seasonId,
      hydrate: "team(division)"
    }))

    if (standings?.records != undefined) {
      setStandings(standings.records);
    }
  }, [team, seasonId]);

  useEffect(() => {
    getStandings();
  }, [getStandings]);

  // Data for Division Standings
  const divisionStandings = standings.find((s) => s.division?.id == team.division?.id)?.teamRecords

  // Data for League Standings
  const leagueStandings: MLBRecord[] = []
  // Get the top three
  standings.forEach((s) => leagueStandings.push(s.teamRecords[0]))
  leagueStandings.sort((a, b) => parseFloat(a.winningPercentage!) > parseFloat(b.winningPercentage!) ? -1 : 1)
  // Get the next three
  const leagueStandingWildCard: MLBRecord[] = []
  standings.forEach((s) => s.teamRecords.forEach((tr) => {
    if (tr.wildCardGamesBack! === '-' || tr.wildCardGamesBack?.startsWith('+')) {
      if (leagueStandings.find((s) => s.team.id == tr.team.id)) return
      leagueStandingWildCard.push(tr)
    }
  }))
  leagueStandingWildCard.sort((a, b) => parseFloat(a.winningPercentage!) > parseFloat(b.winningPercentage!) ? -1 : 1)
  leagueStandings.push(...leagueStandingWildCard)

  return (
    <Stack width={1} height={1} direction={"column"}>
      <Stack direction={"row"}>
        <Box width={"49.5%"}>
          <Typography
            marginTop={2}
            fontWeight={"bold"}
            textAlign={"center"}
            fontSize={"larger"}
            color={"primary.main"}
          >
            Division Standings
          </Typography>
          <Standings standings={divisionStandings} wildCard={false} />
        </Box>
        <Box width={"49.5%"} paddingLeft={"1%"}>
          <Typography
            marginTop={2}
            fontWeight={"bold"}
            textAlign={"center"}
            fontSize={"larger"}
            color={"primary.main"}
          >
            League Standings
          </Typography>
          <Standings standings={leagueStandings} wildCard={true} />
        </Box>
      </Stack>

      <Box paddingTop={3}>
        <Typography
          marginTop={2}
          fontWeight={"bold"}
          textAlign={"center"}
          fontSize={"larger"}
          color={"primary.main"}
        >
          Games Behind
        </Typography>

        <TeamRanking />
      </Box>
    </Stack>
  );
};

export default TeamStats;
