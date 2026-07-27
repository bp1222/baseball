import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  type SelectChangeEvent,
} from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useSeasonTeams, useSeasons } from '../api/queries'
import { trackEvent } from '../lib/analytics'
import { localToday } from '../lib/series'

type SeasonTeamSelectProps = {
  year?: string
  teamId?: number
}

function currentSeasonYear(): string {
  return localToday().slice(0, 4)
}

const selectSx = {
  color: 'common.white',
  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.35)' },
  '.MuiSvgIcon-root': { color: 'common.white' },
  '.MuiSelect-select': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
} as const

export function SeasonTeamSelect({ year, teamId }: SeasonTeamSelectProps) {
  const navigate = useNavigate()
  const seasonsQuery = useSeasons()
  const effectiveYear = year ?? currentSeasonYear()
  const teamsQuery = useSeasonTeams(effectiveYear)
  const teams = teamsQuery.data ?? []
  const teamValue = teamId != null ? String(teamId) : ''

  const onSeasonChange = (event: SelectChangeEvent) => {
    const nextYear = event.target.value
    const selectedTeam = teamId != null ? teams.find((t) => t.id === teamId) : undefined
    trackEvent({
      name: 'select_season',
      season: nextYear,
      team_name: selectedTeam?.name,
    })
    if (teamId != null) {
      void navigate({
        to: '/season/$year/teams/$teamId',
        params: { year: nextYear, teamId: String(teamId) },
      })
      return
    }
    void navigate({ to: '/season/$year', params: { year: nextYear } })
  }

  const onTeamChange = (event: SelectChangeEvent) => {
    const nextTeamId = event.target.value
    if (!nextTeamId) return
    const selectedTeam = teams.find((t) => String(t.id) === nextTeamId)
    if (selectedTeam?.name) {
      trackEvent({
        name: 'select_team',
        season: effectiveYear,
        team_name: selectedTeam.name,
      })
    }
    void navigate({
      to: '/season/$year/teams/$teamId',
      params: { year: effectiveYear, teamId: nextTeamId },
    })
  }

  const clearTeam = () => {
    const selectedTeam = teamId != null ? teams.find((t) => t.id === teamId) : undefined
    trackEvent({
      name: 'clear_team',
      season: effectiveYear,
      team_name: selectedTeam?.name,
    })
    void navigate({ to: '/season/$year', params: { year: effectiveYear } })
  }

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, sm: 1.25 }}
      sx={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: 0,
        flex: 1,
      }}
    >
      <FormControl
        size="small"
        sx={{
          minWidth: { xs: 88, sm: 104 },
          flexShrink: 0,
          bgcolor: 'rgba(255,255,255,0.12)',
          borderRadius: 1,
        }}
      >
        <InputLabel id="season-label" sx={{ color: 'rgba(255,255,255,0.85)' }}>
          Season
        </InputLabel>
        <Select
          labelId="season-label"
          label="Season"
          value={effectiveYear}
          onChange={onSeasonChange}
          sx={selectSx}
        >
          {(seasonsQuery.data ?? [{ seasonId: effectiveYear }]).map((s) => (
            <MenuItem key={s.seasonId} value={s.seasonId}>
              {s.seasonId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack
        direction="row"
        spacing={0.75}
        sx={{ alignItems: 'center', minWidth: 0, flex: '1 1 auto', maxWidth: 240 }}
      >
        <FormControl
          size="small"
          sx={{
            minWidth: 0,
            flex: 1,
            bgcolor: 'rgba(255,255,255,0.12)',
            borderRadius: 1,
          }}
        >
          <Select
            displayEmpty
            value={teamValue}
            onChange={onTeamChange}
            renderValue={(selected) => {
              if (!selected) {
                return <span style={{ opacity: 0.85 }}>Team</span>
              }
              const team = teams.find((t) => String(t.id) === selected)
              return team?.name ?? selected
            }}
            sx={selectSx}
            inputProps={{ 'aria-label': 'Team' }}
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={String(team.id)}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {teamId != null && (
          <IconButton
            size="small"
            aria-label="Clear team"
            onClick={clearTeam}
            sx={{
              width: 28,
              height: 28,
              flexShrink: 0,
              bgcolor: 'rgba(255,255,255,0.22)',
              color: 'common.white',
              fontSize: '1.1rem',
              lineHeight: 1,
              fontWeight: 600,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.38)' },
            }}
          >
            ×
          </IconButton>
        )}
      </Stack>
    </Stack>
  )
}
