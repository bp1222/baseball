import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import {Button, Grid, Menu, MenuItem} from '@mui/material'
import {useQueryClient} from '@tanstack/react-query'
import {useNavigate, useParams} from '@tanstack/react-router'
import {useState} from 'react'

import {useTeams} from '@/queries/team.ts'

export const TeamPicker = () => {
  const { teamId } = useParams({strict: false})
  const { data: teams } = useTeams()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const interestedTeam = teams?.find(t => t.id == teamId)

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isOpen = Boolean(anchorEl)

  const setTeam = (teamId: number | null) => {
    void queryClient.invalidateQueries({ queryKey: ['schedule', teamId] })
    void navigate({
      to: `/{$seasonId}/` + (teamId != null ? `{$teamId}` : ``),
      params: {
        teamId: teamId,
      },
    })
  }

  return (
    <Grid container
           alignItems={'center'}
    >
      <Grid>
        <Button variant={'text'}
                color={'inherit'}
                size={'large'}
                sx={{alignItems: 'flex-start'}}
                endIcon={teamId ? <RemoveCircleIcon onClick={async (e) => {
                  e.stopPropagation()
                  return setTeam(null)
                }}></RemoveCircleIcon> : undefined}
                onClick={(event) => setAnchorEl(event.currentTarget)}>
          {interestedTeam?.name ?? 'Select Team'}
        </Button>
      </Grid>
      <Menu anchorEl={anchorEl}
            open={isOpen}
            onClose={() => setAnchorEl(null)}>
        {teams?.filter((t) => t.id < 1000).map((t) => (
          <MenuItem key={t.name}
                    onClick={() => {
                      setTeam(t.id)
                      setAnchorEl(null)
                    }}>
            {t.name}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  )
}
