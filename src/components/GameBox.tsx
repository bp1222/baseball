import { Box, Typography } from '@mui/material'
import type { Game } from '@bp1222/stats-api'
import { useState } from 'react'
import { useGameLinescore } from '../api/queries'
import { BasePaths, OutsDots } from './BasesOuts'
import { GameDetailModal } from './GameDetailModal'
import {
  formatLinescoreInning,
  formatOutsLabel,
  linescoreBases,
  linescoreHasStarted,
} from '../lib/linescore'
import {
  formatGameDate,
  formatMonthDayUpper,
  gameStatusFooter,
  isGameFinal,
  isGameLive,
} from '../lib/series'
import { teamAbbr } from '../lib/mlb'

type GameBoxProps = {
  game: Game
  perspectiveTeamId?: number
  /** Highlight when this game falls on the landing focus date */
  focusDate?: string
}

export function GameBox({ game, perspectiveTeamId, focusDate }: GameBoxProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const dateKey = formatGameDate(game)
  const { linescore, liveGame } = useGameLinescore(game.gamePk, dateKey)
  const statusGame = liveGame ?? game

  const final = isGameFinal(statusGame)
  const live = !final && (isGameLive(statusGame) || linescoreHasStarted(linescore))

  const home = statusGame.teams.home
  const away = statusGame.teams.away
  const isFocus = focusDate != null && dateKey === focusDate

  const awayScore =
    live && linescore?.teams?.away?.runs != null ? linescore.teams.away.runs : away.score
  const homeScore =
    live && linescore?.teams?.home?.runs != null ? linescore.teams.home.runs : home.score

  const rowTint = (teamIsWinner: boolean, teamId: number) => {
    if (!final || statusGame.isTie) return undefined
    // Postponed / no decision — don't tint.
    if (!away.isWinner && !home.isWinner) return undefined
    // Team page: only color the selected club's row.
    if (perspectiveTeamId != null && teamId !== perspectiveTeamId) return undefined
    return teamIsWinner ? 'rgba(27, 122, 78, 0.18)' : 'rgba(163, 59, 42, 0.16)'
  }

  const scoreOrDash = (score: number | undefined) =>
    final || live ? String(score ?? 0) : '—'

  const bases = linescoreBases(linescore)
  const outs = linescore?.outs

  return (
    <>
      <Box
        role="button"
        tabIndex={0}
        aria-label={`Open details for ${teamAbbr(away.team, 'Away')} at ${teamAbbr(home.team, 'Home')}`}
        onClick={() => setDetailOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setDetailOpen(true)
          }
        }}
        sx={{
          width: 72,
          minWidth: 72,
          border: isFocus ? 2 : '1px solid',
          borderColor: isFocus ? 'primary.main' : live ? 'secondary.main' : 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          // Match the date bar when focused so anti-aliased corner pixels
          // don't show a different background seeping through.
          bgcolor: isFocus ? 'primary.main' : 'background.paper',
          boxShadow: isFocus ? 2 : 0,
          cursor: 'pointer',
          '&:hover': {
            borderColor: isFocus ? 'primary.main' : 'primary.light',
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
        }}
      >
        <Box
          sx={{
            bgcolor: isFocus ? 'primary.main' : 'grey.200',
            color: isFocus ? 'primary.contrastText' : 'text.secondary',
            textAlign: 'center',
            fontSize: '0.65rem',
            fontWeight: isFocus ? 700 : 600,
            py: 0.25,
            px: 0.5,
            letterSpacing: 0.2,
          }}
        >
          {formatMonthDayUpper(dateKey)}
        </Box>

        <Box sx={{ bgcolor: 'background.paper' }}>
          <ScoreRow
            abbr={teamAbbr(away.team, 'AWY')}
            score={scoreOrDash(awayScore)}
            bgcolor={rowTint(away.isWinner, away.team.id)}
            bold={final && away.isWinner}
          />
          <ScoreRow
            abbr={teamAbbr(home.team, 'HME')}
            score={scoreOrDash(homeScore)}
            bgcolor={rowTint(home.isWinner, home.team.id)}
            bold={final && home.isWinner}
          />

          <Box
            sx={{
              height: 18,
              px: 0.25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: live ? 'secondary.main' : 'text.secondary',
            }}
          >
            {live && linescore && linescoreHasStarted(linescore) ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.35,
                  flexWrap: 'nowrap',
                }}
                title={`${formatLinescoreInning(linescore)} · ${formatOutsLabel(outs)}`}
              >
                <Typography
                  variant="caption"
                  component="span"
                  sx={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatLinescoreInning(linescore)}
                </Typography>
                <BasePaths bases={bases} />
                <OutsDots outs={outs ?? 0} />
              </Box>
            ) : (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '0.6rem',
                  fontWeight: live ? 700 : 500,
                  lineHeight: 1,
                }}
              >
                {gameStatusFooter(statusGame)}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <GameDetailModal
        game={statusGame}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  )
}

function ScoreRow({
  abbr,
  score,
  bgcolor,
  bold,
}: {
  abbr: string
  score: string
  bgcolor?: string
  bold?: boolean
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        px: 0.5,
        py: 0.2,
        bgcolor,
        fontSize: '0.7rem',
        fontWeight: bold ? 700 : 500,
      }}
    >
      <Box component="span">{abbr}</Box>
      <Box component="span">{score}</Box>
    </Box>
  )
}
