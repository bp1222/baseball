import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { Button, Grid, Menu, MenuItem } from '@mui/material'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'

import { useInterestedTeamContext } from '@/context/InterestedTeamContext'
import { useTeams } from '@/queries/team'

export const TeamPicker = () => {
  const { seasonId } = useParams({ strict: false })
  const { team: interestedTeam, teamId } = useInterestedTeamContext()
  const { data: teams } = useTeams()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isOpen = Boolean(anchorEl)

  const setTeam = (newTeamId: number | null) => {
    if (seasonId == null) return
    if (newTeamId != null) {
      void navigate({
        to: '/{$seasonId}/{$teamId}',
        params: { seasonId, teamId: String(newTeamId) },
      })
    } else {
      void navigate({
        to: '/{$seasonId}',
        params: { seasonId },
      })
    }
  }

  return (
    <Grid container alignItems={'center'}>
      <Grid>
        <Button
          variant="text"
          color="inherit"
          size="large"
          sx={{
            alignItems: 'center',
            minHeight: 44,
            minWidth: 44,
            maxWidth: { xs: 140, sm: 'none' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          endIcon={
            teamId ? (
              <RemoveCircleIcon
                onClick={(e) => {
                  e.stopPropagation()
                  setTeam(null)
                }}
              />
            ) : undefined
          }
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          {interestedTeam?.name ?? 'Select Team'}
        </Button>
      </Grid>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={() => setAnchorEl(null)}>
        {teams
          ?.filter((t) => t.id < 1000)
          .map((t) => (
            <MenuItem
              key={t.name}
              onClick={() => {
                setTeam(t.id)
                setAnchorEl(null)
              }}
            >
              {t.name}
            </MenuItem>
          ))}
      </Menu>
    </Grid>
  )
}
