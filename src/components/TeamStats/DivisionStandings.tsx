import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from "@mui/material"

import {useAppStateUtil} from "@/state"
import {Standings} from "@/types/Standings.ts"
import {Team} from "@/types/Team.ts"
import LabelPaper from "@/utils/LabelPaper.tsx"

interface StandingsProps {
  team: Team
  standings: Standings[]
}

export const DivisionStandings = ({team, standings}: StandingsProps) => {
  const {getTeam, getDivision} = useAppStateUtil()
  const division = getDivision(team.division)

  if (division == undefined) return

  const divisionStandings = standings
  .filter((s) => s.division == team?.division)
  .flatMap((s) => s.records)
  .sort((a, b) => a.divisionRank
    ? (parseFloat(a.divisionRank) > parseFloat(b.divisionRank!) ? 1 : -1)
    : (parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1))

  return (
    <LabelPaper label={division.name + " Standings"}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: 425,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="left">Team</TableCell>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">W</TableCell>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">L</TableCell>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">Pct</TableCell>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">GB</TableCell>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">E#</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {divisionStandings.map((d) => {
              const team = getTeam(d.teamId)
              return (
                <TableRow key={d.teamId}>
                  <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="left">
                    {team?.teamName}
                  </TableCell>
                  <TableCell align="right">{d.wins}</TableCell>
                  <TableCell align="right">{d.losses}</TableCell>
                  <TableCell align="right">{d.winningPercentage}</TableCell>
                  <TableCell align="right">{d.gamesBack}</TableCell>
                  <TableCell align="right">{d.eliminationNumber}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </LabelPaper>
  )
}
