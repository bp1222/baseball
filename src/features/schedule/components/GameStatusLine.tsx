import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import { Box } from "@mui/material"
import dayjs from "dayjs"

import { useLinescore } from "@/queries/linescore"
import { useTeams } from "@/queries/team"
import { Game } from "@/types/Game"
import { GameStatus } from "@/types/Game/GameStatus"

type GameStatusLineProps = {
  game: Game
}

export const GameStatusLine = ({ game }: GameStatusLineProps) => {
  const isLive = game.gameStatus === GameStatus.InProgress
  const linescore = useLinescore(game.pk, isLive).data
  const { data: teams } = useTeams()
  const awayAbbr =
    teams?.find((t) => t.id === game.away.teamId)?.abbreviation ?? "Away"
  const homeAbbr =
    teams?.find((t) => t.id === game.home.teamId)?.abbreviation ?? "Home"
  const awayScore =
    linescore?.away.runs ?? game.away.score ?? 0
  const homeScore =
    linescore?.home.runs ?? game.home.score ?? 0
  const inningLabel = linescore?.currentInningOrdinal
    ? `${linescore?.isTopInning ? "Top" : "Bot"} ${linescore.currentInningOrdinal}`
    : ""

  const isTbdAbbr = (abbr: string) => /[\d/]/.test(abbr) || abbr === "Away" || abbr === "Home"
  const isTbdMatchup = isTbdAbbr(awayAbbr) && isTbdAbbr(homeAbbr)
  const isTbdTime = dayjs(game.gameDate).utc().format("h:mm A") === "7:33 AM"

  switch (game.gameStatus) {
    case GameStatus.Scheduled:
      if (isTbdTime || isTbdMatchup) {
        return (
          <Box
            sx={{ fontSize: "0.75rem" }}
            textAlign="center"
            color="text.secondary"
            fontWeight={500}
          >
            {isTbdMatchup ? "Matchup TBD" : "TBD"}
          </Box>
        )
      }
      return (
        <Box
          sx={{ fontSize: "0.75rem" }}
          textAlign="center"
          color="text.secondary"
        >
          {dayjs(game.gameDate).format("h:mm A")}
        </Box>
      )
    case GameStatus.InProgress:
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ fontSize: "0.75rem" }}
          textAlign="center"
          color="text.secondary"
        >
          <Box component="span" whiteSpace="nowrap">
            {awayAbbr} {awayScore} – {homeScore} {homeAbbr}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={0.25}
          >
            {linescore?.isTopInning ? (
              <ArrowDropUpIcon sx={{ width: ".6em", height: ".6em" }} />
            ) : (
              <ArrowDropDownIcon sx={{ width: ".6em", height: ".6em" }} />
            )}{" "}
            {inningLabel}
          </Box>
        </Box>
      )
    case GameStatus.Final:
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
          sx={{ fontSize: "0.75rem" }}
          textAlign="center"
          color="text.secondary"
        >
          F
          {(linescore?.innings?.length ?? 9) !== (linescore?.scheduledInnings ?? 9)
            ? `/${linescore?.innings?.length ?? ""}`
            : ""}
        </Box>
      )
    case GameStatus.Postponed:
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
          sx={{ fontSize: "0.75rem", fontWeight: 600 }}
          textAlign="center"
          color="text.secondary"
        >
          Postponed
        </Box>
      )
    case GameStatus.Canceled:
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
          sx={{ fontSize: "0.75rem", fontWeight: 600 }}
          textAlign="center"
          color="text.secondary"
        >
          Canceled
        </Box>
      )
    default:
      return null
  }
}
