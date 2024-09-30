import { TeamRecord } from "@bp1222/stats-api";
import {
  Paper,
  Table,
  TableBody,
  TableCell, TableContainer,
  TableHead,
  TableRow, Typography,
} from "@mui/material";

interface StandingsProps {
  standings: TeamRecord[] | undefined
  league: boolean
}

const DivisionLetter: Record<number, string> = {
  200: "W", // AL West
  201: "E", // AL East
  202: "C", // AL Central
  203: "W", // NL West
  204: "E", // NL East
  205: "C", // NL Central
}

const Standings = ({ standings, league }: StandingsProps) => {
  if (standings == undefined) return

  const teamStanding = (record: TeamRecord, showDivision: boolean, clinchedLeague: boolean) => {
    const playoffIndicator = record.clinched ? (clinchedLeague ? ' - z' : (record.divisionChamp ? ' - y' : ' - w')) : null
    return (
      <TableRow key={record.team?.id}>
        <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="left">
          {(showDivision
            ? DivisionLetter[record.team.division!.id!] + " - "
            : ''
          ) + record.team?.clubName}{playoffIndicator}
        </TableCell>
        <TableCell align="right">{record.wins}</TableCell>
        <TableCell align="right">{record.losses}</TableCell>
        <TableCell align="right">{record.winningPercentage}</TableCell>
        {league
          ? <TableCell align="right">{record.wildCardGamesBack}</TableCell>
          : <TableCell align="right">{record.gamesBack}</TableCell>}
        {league
          ? <TableCell align="right">{record.wildCardEliminationNumber}</TableCell>
          : <TableCell align="right">{record.eliminationNumber}</TableCell>}
      </TableRow>
    );
  };

  return (
    <TableContainer
      component={Paper}
      elevation={2}
      sx={{
        width: { xs: "100%", sm: "49.5%" },
        maxHeight: 425,
        marginTop: { xs: 3, sm: 1 },
        marginLeft: { xs: 0, sm: ".5%" },
        marginRight: { xs: 0, sm: ".5%" },
      }}
    >
      <Typography
        marginTop={1}
        fontWeight={"bold"}
        textAlign={"center"}
        fontSize={"larger"}
        color={"primary.main"}
      >
        {league ? "League Standings" : "Division Standings"}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="left">Team</TableCell>
            <TableCell width={1} style={{whiteSpace: 'nowrap'}}  align="right">W</TableCell>
            <TableCell width={1} style={{whiteSpace: 'nowrap'}}  align="right">L</TableCell>
            <TableCell width={1} style={{whiteSpace: 'nowrap'}}  align="right">Pct</TableCell>
            {league
              ? <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">WCGB</TableCell>
              : <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">GB</TableCell>}
            {league
              ? <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">WC-E#</TableCell>
              : <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">E#</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {standings.map((s, idx) => {
            let clinchedLeague = false
            if (league && idx == 0 && standings[1].leagueGamesBack && standings[1].gamesPlayed) {
              if (parseFloat(standings[1].leagueGamesBack) > (162 - (standings[1].gamesPlayed))) {
                clinchedLeague = true
              }
            }
            return teamStanding(s, league && idx <= 2, clinchedLeague)
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Standings;
