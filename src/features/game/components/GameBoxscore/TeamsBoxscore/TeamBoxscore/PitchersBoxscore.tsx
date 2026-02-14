import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material"

import { BoxscoreTeam } from "@/types/Boxscore"
import {Player} from "@/types/Player.ts"

type PitchersBoxscoreProps = {
  boxscore: BoxscoreTeam
}

export const PitchersBoxscore = ({boxscore}: PitchersBoxscoreProps) => {
  const getPitcher = (b: Player) => {
    return (
      <TableRow key={boxscore.teamId + '-batter-' + b.id}>
        <TableCell>
          {b.name}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.pitching.inningsPitched}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.pitching.hits}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.pitching.runs}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.pitching.earnedRuns}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.pitching.walks}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.pitching.strikeouts}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.pitching.homeRuns}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.pitching.era}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography>
          Pitchers
        </Typography>
        <TableContainer>
          <Table stickyHeader size={"small"}>
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell align={"right"} padding={"checkbox"}>
                  IP
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  H
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  R
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  ER
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  BB
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  K
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  HR
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  ERA
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boxscore.pitchers.map((b) => getPitcher(boxscore.players[b]))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
