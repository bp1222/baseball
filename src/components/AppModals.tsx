/**
 * AppModals - Single location for rendering all application modals
 *
 * This component reads from ModalContext and renders the appropriate modal
 * based on the current state. Rendered at the root level for:
 * - Single modal instance (better performance)
 * - Consistent z-index stacking
 * - Centralized modal management
 */

import { Box, CircularProgress, Modal, Typography } from "@mui/material"
import dayjs from "dayjs"
import { lazy, Suspense } from "react"

import { useModalState } from "@/context/ModalContext"
import { useTeams } from "@/queries/team"
import { Game } from "@/types/Game"
import { GameStatus } from "@/types/Game/GameStatus"

const GameBoxscore = lazy(() =>
  import("@/features/game/components/GameBoxscore").then((module) => ({
    default: module.GameBoxscore,
  }))
)

/**
 * Boxscore modal content
 */
const BoxscoreModalContent = ({ game, onClose }: { game: Game; onClose: () => void }) => {
  const { data: teams } = useTeams()

  const awayAbbr =
    teams?.find((t) => t.id === game.away.teamId)?.abbreviation ?? "Away"
  const homeAbbr =
    teams?.find((t) => t.id === game.home.teamId)?.abbreviation ?? "Home"
  const awayScore = game.away.score ?? 0
  const homeScore = game.home.score ?? 0

  const statusLabel =
    game.gameStatus === GameStatus.Final
      ? "Final"
      : game.gameStatus === GameStatus.InProgress
        ? "Live"
        : game.gameStatus === GameStatus.Scheduled
          ? dayjs(game.gameDate).format("h:mm A")
          : game.gameStatus === GameStatus.Postponed
            ? "Postponed"
            : game.gameStatus === GameStatus.Canceled
              ? "Canceled"
              : ""

  return (
    <Modal
      open
      disableAutoFocus
      onClick={(e) => e.stopPropagation()}
      onClose={onClose}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "calc(100vw - 24px)",
          maxWidth: 850,
          maxHeight: "calc(100vh - 24px)",
          boxSizing: "border-box",
          bgcolor: "background.paper",
          border: "2px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "auto",
          outline: "none",
        }}
      >
        {/* Preview header: shown immediately while boxscore loads */}
        <Box
          sx={{
            padding: { xs: 1.5, sm: 2 },
            borderBottom: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="p" sx={{ fontSize: { xs: "1rem", sm: "inherit" }, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {awayAbbr} @ {homeAbbr}
          </Typography>
          <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", sm: "inherit" } }}>
            {awayScore} – {homeScore}
            {statusLabel ? ` · ${statusLabel}` : ""}
          </Typography>
        </Box>
        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={200}
              padding={2}
            >
              <CircularProgress />
            </Box>
          }
        >
          <GameBoxscore game={game} embedded />
        </Suspense>
      </Box>
    </Modal>
  )
}

/**
 * Main AppModals component - renders the appropriate modal based on state
 */
export const AppModals = () => {
  const { state, close } = useModalState()

  if (state.type === "boxscore") {
    return <BoxscoreModalContent game={state.data} onClose={close} />
  }

  // Add more modal types here as needed:
  // if (state.type === "player") {
  //   return <PlayerModalContent player={state.data} onClose={close} />
  // }

  return null
}
