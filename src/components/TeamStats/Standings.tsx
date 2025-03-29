import {Record} from "@bp1222/stats-api"
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from "@mui/material"

import LabelPaper from "@/utils/LabelPaper.tsx"

interface StandingsProps {
  standings: Record[] | undefined
  league: boolean
  leagueName?: string
  divisionName?: string
}

const DivisionLetter: { [key: number]: string } = {
  200: "W", // AL West
  201: "E", // AL East
  202: "C", // AL Central
  203: "W", // NL West
  204: "E", // NL East
  205: "C", // NL Central
}

export const Standings = ({standings, league, leagueName, divisionName}: StandingsProps) => {
  if (standings == undefined) return

  return (
    <LabelPaper label={league ? leagueName + " Standings" : divisionName + " Standings"}>
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
              const playoffIndicator = s.clinched
                ? (clinchedLeague ? ' - z' : (s.divisionChamp ? ' - y' : ' - w'))
                : null
              return (
                <TableRow key={s.team?.id}>
                  <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="left">
                    {(league && idx <= 2 && s.team.division?.id
                        ? DivisionLetter[s.team.division.id] + " - "
                        : ''
                    ) + s.team?.clubName}{playoffIndicator}
                  </TableCell>
                  <TableCell align="right">{s.wins}</TableCell>
                  <TableCell align="right">{s.losses}</TableCell>
                  <TableCell align="right">{s.winningPercentage}</TableCell>
                  {league
                    ? <TableCell align="right">{s.wildCardGamesBack}</TableCell>
                    : <TableCell align="right">{s.gamesBack}</TableCell>}
                  {league
                    ? <TableCell align="right">{s.wildCardEliminationNumber}</TableCell>
                    : <TableCell align="right">{s.eliminationNumber}</TableCell>}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </LabelPaper>
  )
}
