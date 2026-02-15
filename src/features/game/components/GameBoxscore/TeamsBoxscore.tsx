import {
  Alert,
  Box,
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { useState } from "react"

import { useBoxscore } from "@/queries/boxscore"
import { useTeam } from "@/queries/team"
import { Game } from "@/types/Game"
import { GameStatus } from "@/types/Game/GameStatus"

import { TeamBoxscore } from "./TeamsBoxscore/TeamBoxscore"

type TeamsBoxscoreProps = {
  game: Game
}

type TeamTab = "away" | "home"

const teamCardSx = {
  p: 1.5,
  borderRadius: 1.5,
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider",
}

const teamLabelSx = {
  color: "text.secondary",
  fontWeight: 600,
  mb: 1,
  pb: 0.5,
  borderBottom: 1,
  borderColor: "divider",
}

export const TeamsBoxscore = ({ game }: TeamsBoxscoreProps) => {
  const { data: homeTeam } = useTeam(game.home.teamId)
  const { data: awayTeam } = useTeam(game.away.teamId)
  const isLive = game.gameStatus === GameStatus.InProgress
  const {
    data: boxscore,
    isPending,
    isError,
    refetch: refetchBoxscore,
  } = useBoxscore(game.pk, isLive)

  const [teamTab, setTeamTab] = useState<TeamTab>("away")

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" py={3}>
        <CircularProgress />
      </Box>
    )
  }
  if (isError) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Alert severity="error">
          Error loading boxscore. Check back later or try again.
        </Alert>
        <Button
          variant="contained"
          size="small"
          onClick={() => void refetchBoxscore()}
        >
          Retry
        </Button>
      </Box>
    )
  }

  const handleTeamTab = (_: React.MouseEvent<HTMLElement>, value: TeamTab | null) => {
    if (value !== null) setTeamTab(value)
  }

  const awayCard = (
    <Box sx={teamCardSx}>
      <Typography variant="subtitle2" sx={teamLabelSx}>
        {awayTeam?.abbreviation ?? "AWAY"}
      </Typography>
      <TeamBoxscore boxscore={boxscore.away} />
    </Box>
  )

  const homeCard = (
    <Box sx={teamCardSx}>
      <Typography variant="subtitle2" sx={teamLabelSx}>
        {homeTeam?.abbreviation ?? "HOME"}
      </Typography>
      <TeamBoxscore boxscore={boxscore.home} />
    </Box>
  )

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <ToggleButtonGroup
          value={teamTab}
          exclusive
          onChange={handleTeamTab}
          aria-label="Select team"
          size="small"
          sx={{
            "& .MuiToggleButtonGroup-grouped": {
              border: 1,
              px: 2,
              py: 1,
            },
          }}
        >
          <ToggleButton value="away" aria-label="Away team">
            {awayTeam?.abbreviation ?? "AWAY"}
          </ToggleButton>
          <ToggleButton value="home" aria-label="Home team">
            {homeTeam?.abbreviation ?? "HOME"}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {teamTab === "away" ? awayCard : homeCard}
    </Box>
  )
}
