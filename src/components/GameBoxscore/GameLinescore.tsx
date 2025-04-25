import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import {useEffect} from "react"

import {getGameLinescore} from "@/services/MlbAPI"
import {useAppStateApi, useAppStateUtil} from "@/state"
import {Game} from "@/types/Game.ts"
import {GameStatus} from "@/types/Game/GameStatus.ts"
import {LinescoreTeam} from "@/types/Linescore.ts"
import {Team} from "@/types/Team.ts"

type GameLinescoreProps = {
  game: Game
}

export const GameLinescore = ({game}: GameLinescoreProps) => {
  const {setLinescore} = useAppStateApi()
  const {getTeam} = useAppStateUtil()

  useEffect(() => {
    getGameLinescore(game).then((linescore) => {
      setLinescore(game.pk, linescore)
    })
  }, [setLinescore, game])

  const teamRow = (team: Team, teamInnings: LinescoreTeam[], teamTotal: LinescoreTeam) => {
    return (
      <TableRow>
        <TableCell>{team?.abbreviation}</TableCell>
        {Array.from({length: Math.max((game.linescore?.innings?.length ?? 0), (game.linescore?.scheduledInnings ?? 9))}, (_, index) => {
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
                    {game.linescore?.innings.length != undefined
                    && game.linescore?.away.runs != undefined
                    && game.linescore?.home.runs != undefined
                    && game.home.teamId == team?.id
                    && index + 1 == game.linescore?.innings.length
                    && game.linescore?.home.runs > game.linescore?.away.runs
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

  if (game.linescore == undefined) {
    return
  }

  return (
    <TableContainer component={Paper} elevation={1}>
      <Table padding={"checkbox"}>
        <TableHead>
          <TableRow>
            <TableCell/>

            {Array.from({length: Math.max((game.linescore.innings.length ?? 0), (game.linescore.scheduledInnings ?? 9))}, (_, index) => (
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
          {teamRow(getTeam(game.away.teamId)!, game.linescore!.innings.map(i => i.away), game.linescore!.away)}
          {teamRow(getTeam(game.home.teamId)!, game.linescore!.innings.map(i => i.home), game.linescore!.home)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
