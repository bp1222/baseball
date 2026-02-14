import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import { useParams } from "@tanstack/react-router"

import { useInterestedTeam } from "@/context/InterestedTeamContext"

import { HeaderName } from "./Header/HeaderName"
import { SeasonPicker } from "./Header/SeasonPicker"
import { TeamPicker } from "./Header/TeamPicker"

export const Header = () => {
  const { seasonId } = useParams({ strict: false })
  const selectedTeam = useInterestedTeam()

  return (
    <AppBar position="sticky" sx={{ marginBottom: 2 }}>
      <Toolbar sx={{ minWidth: 0, px: { xs: 0.5, sm: 2 } }}>
        {/* Left: app name */}
        <Box
          sx={{
            flex: "0 0 auto",
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <HeaderName />
        </Box>

        {/* Center: season picker */}
        <Box
          sx={{
            flex: "1 1 0",
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 0.5,
          }}
        >
          <SeasonPicker />
        </Box>

        {/* Right: team picker (with cancel when team selected) */}
        <Box
          sx={{
            flex: "0 0 auto",
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <TeamPicker />
        </Box>
      </Toolbar>

      {seasonId && selectedTeam && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pb: 0.5,
            px: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            component="span"
            sx={{
              opacity: 0.9,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {seasonId} • {selectedTeam.name}
          </Typography>
        </Box>
      )}
    </AppBar>
  )
}
