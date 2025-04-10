import {BoxscoreTeam, Player} from "@bp1222/stats-api"
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material"


type TeamBoxscoreProps = {
  boxscore: BoxscoreTeam
}

export const TeamBoxscore = ({boxscore}: TeamBoxscoreProps) => {
  const batters = Object.values(boxscore.players!).filter((p) => p.battingOrder != undefined).sort((a, b) => {
    return a.battingOrder! - b.battingOrder!
  })

  const getBatter = (b: Player) => {
    const indent = b.battingOrder! % 100
    return (
      <TableRow key={boxscore.team.id + '-batter-' + b.person.id}>
        <TableCell>
          <Typography fontSize={"small"} marginLeft={indent} display={"inline"}>
            {b.person.boxscoreName}
          </Typography>
          <Typography fontSize={"x-small"} marginLeft={1} display={"inline"}>
            {b.position.abbreviation}
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
          {b.seasonStats.batting.avg}
        </TableCell>
        <TableCell align={"right"} padding={"checkbox"}>
          {b.seasonStats.batting.ops}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Paper sx={{width: '100%', overflow: 'hidden'}}>
      <TableContainer>
        <Table stickyHeader size={"small"}>
          <TableHead>
            <TableRow>
              <TableCell>
                Batters
              </TableCell>
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
            {batters.map((b) => getBatter(b))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}