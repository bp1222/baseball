import { MLBRecord } from "@bp1222/stats-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

interface StandingsProps {
  standings: MLBRecord[] | undefined
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

  const teamStanding = (record: MLBRecord, showDivision: boolean) => {
    return (
      <TableRow key={record.team?.id}>
        <TableCell padding={"normal"}>{(showDivision ? DivisionLetter[record.team.division!.id!] + " - " : '') + record.team?.name}</TableCell>
        <TableCell padding={"checkbox"} align="right">{record.wins}</TableCell>
        <TableCell padding={"checkbox"} align="right">{record.losses}</TableCell>
        <TableCell padding={"checkbox"} align="right">{record.winningPercentage}</TableCell>
        <TableCell padding={league ? "normal" : "checkbox"} align="right">{league ? record.wildCardGamesBack : record.gamesBack}</TableCell>
        {!league ? <TableCell padding={"checkbox"} align="right">{record.eliminationNumber}</TableCell> : <></>}
        {!league ? <TableCell padding={"normal"} align="right">{record.wildCardEliminationNumber}</TableCell> : <></>}
      </TableRow>
    );
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding={"normal"}>Team</TableCell>
          <TableCell padding={"checkbox"} align="right">W</TableCell>
          <TableCell padding={"checkbox"} align="right">L</TableCell>
          <TableCell padding={"checkbox"} align="right">Pct</TableCell>
          <TableCell padding={league ? "normal" : "checkbox"} align="right">GB</TableCell>
          {!league ? <TableCell padding={"checkbox"} align="right">E#</TableCell> : <></>}
          {!league ? <TableCell padding={"normal"} align="right">WC-E#</TableCell> : <></>}
        </TableRow>
      </TableHead>
      <TableBody>
        {standings.map((s, idx) => teamStanding(s, league && idx <= 2))}
      </TableBody>
    </Table>
  );
};

export default Standings;
