import { Box, Paper, Stack, Typography } from '@mui/material'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useSeasonTeams } from '../api/queries'
import { QueryState } from '../components/QueryState'
import { TeamLogo } from '../components/TeamLogo'
import { trackEvent } from '../lib/analytics'

export const Route = createFileRoute('/season/$year/')({
  component: SeasonPage,
})

function SeasonPage() {
  const { year } = Route.useParams()
  const { data, isLoading, isError, error } = useSeasonTeams(year)

  useEffect(() => {
    trackEvent({ name: 'view_season', season: year })
  }, [year])

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" gutterBottom>
          {year} Teams
        </Typography>
        <Typography color="text.secondary">
          Select a team to view series results and standings.
        </Typography>
      </Box>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && (data?.length ?? 0) === 0}
        emptyMessage="No MLB teams found for this season."
      >
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
          }}
        >
          {(data ?? []).map((team) => (
            <Link
              key={team.id}
              to="/season/$year/teams/$teamId"
              params={{ year, teamId: String(team.id) }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  height: '100%',
                  transition: 'transform 180ms ease, box-shadow 180ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(11,61,46,0.14)',
                  },
                }}
              >
                <TeamLogo teamId={team.id} alt={team.name} size={40} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap sx={{ fontWeight: 700 }}>
                    {team.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {team.division?.name ?? team.league?.name ?? 'MLB'}
                  </Typography>
                </Box>
              </Paper>
            </Link>
          ))}
        </Box>
      </QueryState>
    </Stack>
  )
}
