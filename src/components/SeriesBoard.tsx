import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import type { Team } from '@bp1222/stats-api'
import {
  formatMonthDay,
  opponentOf,
  seriesDateRange,
  seriesOpponentPreposition,
  seriesOutcomeColors,
  seriesOutcomeForTeam,
  seriesOutcomeLabel,
  type Series,
} from '../lib/series'
import { GameBox } from './GameBox'
import { SERIES_CARD_MAX_WIDTH } from './SeriesCard'
import { SeriesRoundBadge } from './SeriesRoundBadge'
import { TeamLogo } from './TeamLogo'

type SeriesBoardProps = {
  seriesList: Series[]
  teamId: number
}

const GAME_TILE_WIDTH = 72
const GAME_GAP = 8
const GAMES_PER_ROW = 4
const GAMES_ROW_MAX_WIDTH =
  GAMES_PER_ROW * GAME_TILE_WIDTH + (GAMES_PER_ROW - 1) * GAME_GAP

function sameLabel(a?: string, b?: string): boolean {
  return Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase())
}

/** Market label (e.g. "New York"); omitted when franchise has no distinct location. */
function teamMarketLabel(team: Team): string | undefined {
  const market = team.franchiseName?.trim()
  if (!market) return undefined
  // Athletics (2025+): franchiseName/teamName/shortName are all "Athletics"
  if (sameLabel(market, team.teamName) || sameLabel(market, team.clubName)) {
    return undefined
  }
  // Only treat shortName as a nickname when it matches teamName (not "Colorado")
  if (sameLabel(team.shortName, team.teamName) && sameLabel(market, team.shortName)) {
    return undefined
  }
  return market
}

/**
 * Newspaper-style columns: series flow top→bottom in column 1, then column 2.
 * Layout mirrors baseballseries.info: opponent block left, game tiles right.
 */
export function SeriesBoard({ seriesList, teamId }: SeriesBoardProps) {
  if (seriesList.length === 0) {
    return <Typography color="text.secondary">No series found for this team.</Typography>
  }

  return (
    <Box
      sx={{
        columnCount: { xs: 1, sm: 2 },
        columnGap: 2,
      }}
    >
      {seriesList.map((series) => {
        const opponent = opponentOf(series, teamId)
        const outcome = seriesOutcomeForTeam(series, teamId)
        const colors = seriesOutcomeColors(outcome)
        const { start, end } = seriesDateRange(series)
        const preposition = seriesOpponentPreposition(series, teamId)
        const market = teamMarketLabel(opponent)

        return (
          <Paper
            key={series.id}
            sx={{
              p: 1,
              pt: 1.5,
              mb: 1.5,
              bgcolor: colors.light,
              borderColor: colors.main,
              borderWidth: 1,
              position: 'relative',
              breakInside: 'avoid',
              display: 'inline-block',
              width: '100%',
              maxWidth: SERIES_CARD_MAX_WIDTH,
            }}
          >
            <Chip
              size="small"
              label={seriesOutcomeLabel(outcome)}
              sx={{
                position: 'absolute',
                top: -10,
                left: 8,
                height: 22,
                fontWeight: 700,
                bgcolor: colors.main,
                color: '#fff',
              }}
            />

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
                spacing={0.25}
                sx={{
                  width: 120,
                  minWidth: 120,
                  alignItems: 'center',
                  flexShrink: 0,
                  py: 0.5,
                }}
              >
                <TeamLogo teamId={opponent.id} alt={opponent.name} size={40} />
                <Typography
                  variant="caption"
                  sx={{ fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.2 }}
                >
                  {market ? `${preposition} ${market}` : preposition}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    lineHeight: 1.2,
                  }}
                >
                  {opponent.teamName ?? opponent.abbreviation ?? opponent.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textAlign: 'center' }}
                >
                  {formatMonthDay(start)} – {formatMonthDay(end)}
                </Typography>
                <SeriesRoundBadge series={series} perspectiveTeamId={teamId} />
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
                  <GameBox key={game.gamePk} game={game} perspectiveTeamId={teamId} />
                ))}
              </Box>
            </Stack>
          </Paper>
        )
      })}
    </Box>
  )
}
