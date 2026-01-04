import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"

import {useLinescore} from "@/queries/linescore.ts"
import {useTeam} from "@/queries/team.ts"
import {Game} from "@/types/Game.ts"
import {GameStatus} from "@/types/Game/GameStatus.ts"
import {LinescoreTeam} from "@/types/Linescore.ts"
import {Team} from "@/types/Team.ts"

type GameLinescoreProps = {
  game: Game
}

export const GameLinescore = ({game}: GameLinescoreProps) => {
  const { data: homeTeam } = useTeam(game.home.teamId)
  const { data: awayTeam } = useTeam(game.away.teamId)
  const { data: linescore, isPending, isError } = useLinescore(game.pk)

  const teamRow = (team: Team | undefined, teamInnings: LinescoreTeam[], teamTotal: LinescoreTeam) => {
    return (
      <TableRow>
        <TableCell>{team?.abbreviation}</TableCell>
        {Array.from({length: Math.max((linescore?.innings?.length ?? 0), (linescore?.scheduledInnings ?? 9))}, (_, index) => {
            switch (game?.gameStatus) {
              case GameStatus.Scheduled:
              case GameStatus.InProgress:
                return (
                  <TableCell key={game.pk + '-linescore-' + team?.id + '-' + index}>
                    {teamInnings?.[index]?.runs ?? ''}
                  </TableCell>
                )
              default:
                return (
                  <TableCell key={game.pk + '-linescore-' + team?.id + '-' + index}>
                    {linescore?.innings.length != undefined
                    && linescore?.away.runs != undefined
                    && linescore?.home.runs != undefined
                    && game.home.teamId == team?.id
                    && index + 1 == linescore?.innings.length
                    && linescore?.home.runs > linescore?.away.runs
                    && teamInnings?.[index]?.runs == undefined
                      ? 'X' : (teamInnings?.[index]?.runs ?? 0)}
                  </TableCell>
                )
            }
          }
        )}

        <TableCell/>

        <TableCell>
          {teamTotal.runs ?? 0}
        </TableCell>
        <TableCell>
          {teamTotal.hits ?? 0}
        </TableCell>
        <TableCell>
          {teamTotal.errors ?? 0}
        </TableCell>
      </TableRow>
    )
  }

  if (isPending) {
    return <CircularProgress />
  } else if (isError) {
    return <Alert severity={'error'}>Error Loading Linescore</Alert>
  }

  return (
    <TableContainer component={Paper} elevation={1}>
      <Table padding={"checkbox"}>
        <TableHead>
          <TableRow>
            <TableCell/>

            {Array.from({length: Math.max((linescore.innings.length ?? 0), (linescore.scheduledInnings ?? 9))}, (_, index) => (
              <TableCell key={game.pk + '-linescore-' + index}>
                {index + 1}
              </TableCell>
            ))}

            <TableCell/>

            <TableCell>
              R
            </TableCell>
            <TableCell>
              H
            </TableCell>
            <TableCell>
              E
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teamRow(awayTeam, linescore!.innings.map(i => i.away), linescore!.away)}
          {teamRow(homeTeam, linescore!.innings.map(i => i.home), linescore!.home)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
