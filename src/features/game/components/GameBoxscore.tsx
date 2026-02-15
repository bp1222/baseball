import { Box, Typography } from "@mui/material"
import { Fragment } from "react"

import { Game } from "@/types/Game"

import { GameLinescore } from "./GameBoxscore/GameLinescore"
import { ScorecardHero } from "./GameBoxscore/ScorecardHero"
import { TeamsBoxscore } from "./GameBoxscore/TeamsBoxscore"

type GameBoxscoreProps = {
  game: Game
  /** When true, omit outer container (for use inside modal with preview header). */
  embedded?: boolean
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="overline"
    sx={{
      display: "block",
      color: "text.secondary",
      fontWeight: 600,
      letterSpacing: 1,
      mb: 1,
    }}
  >
    {children}
  </Typography>
)

export const GameBoxscore = ({ game, embedded }: GameBoxscoreProps) => {
  const content = (
    <Fragment>
      {/* Hero scorecard */}
      <Box sx={{ width: "100%", mb: 2 }}>
        <ScorecardHero game={game} />
      </Box>

      {/* Linescore */}
      <Box sx={{ width: "100%", mb: 3 }}>
        <SectionLabel>Linescore</SectionLabel>
        <Box sx={{ width: "100%", maxWidth: 720, mx: "auto" }}>
          <GameLinescore game={game} />
        </Box>
      </Box>

      {/* Batting & pitching — both teams side by side */}
      <Box sx={{ width: "100%" }}>
        <SectionLabel>Batting & pitching</SectionLabel>
        <TeamsBoxscore game={game} />
      </Box>
    </Fragment>
  )

  if (embedded) {
    return (
      <Box sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2 }, maxWidth: 900, mx: "auto", minWidth: 0 }}>{content}</Box>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "auto",
        marginTop: "4vh",
        minHeight: "70vh",
        maxHeight: "90vh",
        width: "95vw",
        maxWidth: 850,
        bgcolor: "background.paper",
        padding: 2,
        overflow: "auto",
        border: 2,
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      {content}
    </Box>
  )
}
