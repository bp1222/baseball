import { useCallback, useContext, useEffect, useState } from "react";
import { AppStateContext } from "../state/Context";
import { useParams } from "react-router-dom";
import { MlbApi, MLBRecord, MLBStandings, MLBTeam } from "../services/MlbApi";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const api = new MlbApi();

const Standings = () => {
  const { state } = useContext(AppStateContext);
  const [standings, setStandings] = useState<MLBStandings[]>([]);
  const { seasonId, teamId } = useParams();

  const team: MLBTeam = state.teams.find(
    (t) => t.id == parseInt(teamId ?? ""),
  )!;

  const getStandings = useCallback(async () => {
    if (team == undefined) return;
    if (seasonId == undefined) return;

    const standings = await api.getStandings({
      leagueId: team.league!.id!,
      season: seasonId,
    });

    if (standings.records != undefined) {
      setStandings(standings.records);
    }
  }, [team, seasonId]);

  useEffect(() => {
    getStandings();
  }, [getStandings]);

  console.log(standings);

  const teamStanding = (record: MLBRecord) => {
    return (
      <TableRow key={record.team?.id}>
        <TableCell>{record.team?.name}</TableCell>
        <TableCell align="right">{record.wins}</TableCell>
        <TableCell align="right">{record.losses}</TableCell>
        <TableCell align="right">{record.winningPercentage}</TableCell>
      </TableRow>
    );
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell align="right">Wins</TableCell>
              <TableCell align="right">Losses</TableCell>
              <TableCell align="right">Pct</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standings
              .find((s) => s.division?.id == team.division?.id)
              ?.teamRecords?.map((t) => teamStanding(t))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Standings;
