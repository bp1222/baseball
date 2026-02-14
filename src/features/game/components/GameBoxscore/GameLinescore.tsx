import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

import { useLinescore } from "@/queries/linescore"
import { useTeam } from "@/queries/team"
import { Game } from "@/types/Game"
import { GameStatus } from "@/types/Game/GameStatus"
import { LinescoreTeam } from "@/types/Linescore"
import { Team } from "@/types/Team"

type GameLinescoreProps = {
  game: Game
}

export const GameLinescore = ({ game }: GameLinescoreProps) => {
  const { data: homeTeam } = useTeam(game.home.teamId)
  const { data: awayTeam } = useTeam(game.away.teamId)
  const isLive = game.gameStatus === GameStatus.InProgress
  const {
    data: linescore,
    isPending,
    isError,
    refetch: refetchLinescore,
  } = useLinescore(game.pk, isLive)

  const inningCount = linescore
    ? Math.max(linescore.innings?.length ?? 0, linescore.scheduledInnings ?? 9)
    : 9

  const teamRow = (
    team: Team | undefined,
    teamInnings: LinescoreTeam[],
    teamTotal: LinescoreTeam
  ) => (
    <TableRow sx={{ "&:last-child td": { borderBottom: 0 } }}>
      <TableCell sx={{ fontWeight: 600 }}>{team?.abbreviation}</TableCell>
      {Array.from({ length: inningCount }, (_, index) => {
        switch (game?.gameStatus) {
          case GameStatus.Scheduled:
          case GameStatus.InProgress:
            return (
              <TableCell
                key={game.pk + "-linescore-" + team?.id + "-" + index}
                align="center"
              >
                {teamInnings?.[index]?.runs ?? ""}
              </TableCell>
            )
          default:
            return (
              <TableCell
                key={game.pk + "-linescore-" + team?.id + "-" + index}
                align="center"
              >
                {linescore?.innings?.length != null &&
                linescore?.away?.runs != null &&
                linescore?.home?.runs != null &&
                game.home.teamId === team?.id &&
                index + 1 === linescore.innings.length &&
                linescore.home.runs > linescore.away.runs &&
                teamInnings?.[index]?.runs == null
                  ? "X"
                  : teamInnings?.[index]?.runs ?? 0}
              </TableCell>
            )
        }
      })}
      <TableCell />
      <TableCell align="center" sx={{ fontWeight: 600 }}>
        {teamTotal.runs ?? 0}
      </TableCell>
      <TableCell align="center" sx={{ fontWeight: 600 }}>
        {teamTotal.hits ?? 0}
      </TableCell>
      <TableCell align="center" sx={{ fontWeight: 600 }}>
        {teamTotal.errors ?? 0}
      </TableCell>
    </TableRow>
  )

  if (isPending) {
    return <CircularProgress />
  }
  if (isError) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Alert severity="error">
          Error loading linescore. Check back later or try again.
        </Alert>
        <Button
          variant="contained"
          size="small"
          onClick={() => void refetchLinescore()}
        >
          Retry
        </Button>
      </Box>
    )
  }

  const minTableWidth = 56 + inningCount * 28 + 16 + 36 * 3

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
        overflowX: "auto",
        overflowY: "hidden",
        // Ensure horizontal scroll on narrow viewports; no horizontal scroll on wide
        maxWidth: "100%",
        "&::-webkit-scrollbar": { height: 6 },
        "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "grey.400" },
      }}
    >
      <Table size="small" padding="normal" sx={{ minWidth: minTableWidth }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.100" }}>
            <TableCell sx={{ fontWeight: 600, width: 48, minWidth: 48 }} />
            {Array.from({ length: inningCount }, (_, index) => (
              <TableCell
                key={game.pk + "-linescore-" + index}
                align="center"
                sx={{
                  width: 28,
                  minWidth: 28,
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              >
                {index + 1}
              </TableCell>
            ))}
            <TableCell sx={{ width: 16, minWidth: 16 }} />
            <TableCell align="center" sx={{ fontWeight: 700, width: 36, minWidth: 36 }}>
              R
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, width: 36, minWidth: 36 }}>
              H
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, width: 36, minWidth: 36 }}>
              E
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teamRow(awayTeam, linescore!.innings.map((i) => i.away), linescore!.away)}
          {teamRow(homeTeam, linescore!.innings.map((i) => i.home), linescore!.home)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
