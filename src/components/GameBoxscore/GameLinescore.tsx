import {Game, GameStatusCode, Linescore, LinescoreTeam, Team} from "@bp1222/stats-api"
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import {useContext, useEffect, useState} from "react"

import {getGameLinescore} from "@/services/MlbAPI"
import {AppStateContext} from "@/state/context.ts"
import {GetTeam} from "@/utils/GetTeam.ts"

type GameLinescoreProps = {
  game: Game
}

export const GameLinescore = ({game}: GameLinescoreProps) => {
  const {state} = useContext(AppStateContext)
  const [linescore, setLinescore] = useState<Linescore>()

  useEffect(() => {
    getGameLinescore(game.gamePk).then((linescore) => {
      setLinescore(linescore)
    })
  }, [game])

  const teamRow = (team: Team | undefined, linescoreTeam: LinescoreTeam | undefined, teamInnings: LinescoreTeam[] | undefined) => {
    return (
      <TableRow>
        <TableCell>{team?.abbreviation}</TableCell>
        {Array.from({length: Math.max((linescore?.innings?.length ?? 0), (linescore?.scheduledInnings ?? 9))}, (_, index) => {
            switch (game.status.codedGameState) {
              case GameStatusCode.Scheduled:
              case GameStatusCode.Pregame:
              case GameStatusCode.InProgress:
                return (
                  <TableCell key={game.gamePk + '-linescore-' + team?.id + '-' + index}>
                    {teamInnings?.[index]?.runs ?? ''}
                  </TableCell>
                )
              default:
                return (
                  <TableCell key={game.gamePk + '-linescore-' + team?.id + '-' + index}>
                    {linescore?.innings?.length != undefined
                    && linescore?.teams?.away?.runs != undefined
                    && linescore?.teams?.home?.runs != undefined
                    && game.teams.home.team.id == team?.id
                    && index + 1 < (game.scheduledInnings ?? (linescore?.scheduledInnings ?? 9))
                    && index + 1 == linescore.innings.length
                    && linescore.teams.home.runs > linescore.teams.away.runs
                      ? 'X' : (teamInnings?.[index]?.runs ?? 0)}
                  </TableCell>
                )
            }
          }
        )}

        <TableCell/>

        <TableCell>
          {linescoreTeam?.runs ?? 0}
        </TableCell>
        <TableCell>
          {linescoreTeam?.hits ?? 0}
        </TableCell>
        <TableCell>
          {linescoreTeam?.errors ?? 0}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableContainer component={Paper} elevation={1}>
      <Table padding={"checkbox"}>
        <TableHead>
          <TableRow>
            <TableCell/>

            {Array.from({length: Math.max((linescore?.innings?.length ?? 0), (linescore?.scheduledInnings ?? 9))}, (_, index) => (
              <TableCell key={game.gamePk + '-linescore-' + index}>
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
          {teamRow(GetTeam(state.teams, game.teams.away.team.id), linescore?.teams?.away, linescore?.innings?.flatMap((inning) => inning.away!))}
          {teamRow(GetTeam(state.teams, game.teams.home.team.id), linescore?.teams?.home, linescore?.innings?.flatMap((inning) => inning.home!))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}