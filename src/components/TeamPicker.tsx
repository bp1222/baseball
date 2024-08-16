import { useContext, useState } from 'react'
import { Team } from '../services/client-api'
import { MenuItem, Button, Menu, Typography } from '@mui/material'
import { AppStateAction, AppStateContext } from '../AppContext'

function TeamPicker() {
  const { state, dispatch } = useContext(AppStateContext)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleTeamSelect = (team: Team) => {
    dispatch({
      type: AppStateAction.Team,
      team: team,
    })
    setAnchorEl(null)
  }

  return <>
    <Button
      id="team-selection-button"
      onClick={(event) => setAnchorEl(event.currentTarget)}
      color='inherit'
      sx={{
        float: 'right',
        alignContent: 'center',
        verticalAlign: 'center',
      }}
    >
      <Typography>
        {state.team.name ? state.team.name : "Select Team"}
      </Typography>
    </Button>
    <Menu
      id="team-selection-menu"
      open={anchorEl != null}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
    >
      {state.teams?.map((v) => <MenuItem onClick={() => handleTeamSelect(v)} key={v.teamCode}>{v.name}</MenuItem>)}
    </Menu>
  </>
}

export default TeamPicker