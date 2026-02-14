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

type BattersBoxscoreProps = {
  boxscore: BoxscoreTeam
}

export const BattersBoxscore = ({boxscore}: BattersBoxscoreProps) => {
  const getBatter = (b: Player) => {
    if (b.battingOrder == 0) return

    const indent = b.battingOrder % 100

    return (
      <TableRow key={boxscore.teamId + '-batter-' + b.id}>
        <TableCell>
          <Typography fontSize={"small"} marginLeft={indent} display={"inline"}>
            {b.name}
          </Typography>
          <Typography fontSize={"x-small"} marginLeft={1} display={"inline"}>
            {b.position}
          </Typography>
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.batting.atBats}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.batting.runs}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.batting.hits}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.batting.rbi}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.batting.baseOnBalls}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.batting.strikeOuts}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.batting.avg}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.stats.batting.ops}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography>
          Batters
        </Typography>
        <TableContainer>
          <Table stickyHeader size={"small"}>
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell align={"right"} padding={"checkbox"}>
                  AB
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  R
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  H
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  RBI
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  BB
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  K
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  AVG
                </TableCell>
                <TableCell align={"right"} padding={"checkbox"}>
                  OPS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boxscore.batters.map((b) => getBatter(boxscore.players[b]))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
