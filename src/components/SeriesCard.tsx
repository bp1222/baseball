import { Box, Paper, Stack, Typography } from '@mui/material'
import type { Series } from '../lib/series'
import { formatMonthDay, seriesDateRange } from '../lib/series'
import { GameBox } from './GameBox'
import { TeamLogo } from './TeamLogo'

type SeriesCardProps = {
  series: Series
  muted?: boolean
  perspectiveTeamId?: number
  focusDate?: string
}

const GAME_TILE_WIDTH = 72
const GAME_GAP = 8
const GAMES_PER_ROW = 4
const GAMES_ROW_MAX_WIDTH =
  GAMES_PER_ROW * GAME_TILE_WIDTH + (GAMES_PER_ROW - 1) * GAME_GAP

/** Opponent block + one games row + padding — keeps cards from stretching wide. */
export const SERIES_CARD_MAX_WIDTH = 480

export function SeriesCard({
  series,
  muted = false,
  focusDate,
}: SeriesCardProps) {
  const away = series.awayTeam
  const home = series.homeTeam
  const { start, end } = seriesDateRange(series)

  return (
    <Paper
      sx={{
        p: 1,
        width: '100%',
        maxWidth: SERIES_CARD_MAX_WIDTH,
        opacity: muted ? 0.85 : 1,
        bgcolor: muted ? 'background.paper' : 'grey.100',
        borderColor: muted ? 'divider' : 'grey.400',
        borderWidth: muted ? 1 : 2,
        height: '100%',
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: 1,
          minWidth: 0,
        }}
      >
        <Stack
          spacing={0.5}
          sx={{
            width: 120,
            minWidth: 120,
            alignItems: 'center',
            flexShrink: 0,
            py: 0.5,
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
            <TeamLogo teamId={away.id} alt={away.name} size={36} />
            <Typography variant="caption" color="text.secondary">
              @
            </Typography>
            <TeamLogo teamId={home.id} alt={home.name} size={36} />
          </Stack>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}
          >
            {away.abbreviation ?? away.teamName} @ {home.abbreviation ?? home.teamName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatMonthDay(start)} – {formatMonthDay(end)}
          </Typography>
        </Stack>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            gap: `${GAME_GAP}px`,
            maxWidth: GAMES_ROW_MAX_WIDTH,
            ml: 'auto',
          }}
        >
          {series.games.map((game) => (
            <GameBox
              key={game.gamePk}
              game={game}
              focusDate={focusDate}
            />
          ))}
        </Box>
      </Stack>
    </Paper>
  )
}
