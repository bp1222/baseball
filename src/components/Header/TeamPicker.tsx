import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import {Button, Grid, Menu, MenuItem} from "@mui/material"
import {useState} from "react"
import {useNavigate, useParams} from "react-router-dom"

import {useAppState} from "@/state"

export const TeamPicker = () => {
  const {teams} = useAppState()
  const {seasonId, interestedTeamId} = useParams()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isOpen = Boolean(anchorEl)
  const navigate = useNavigate()
  const interestedTeam = teams.find(t => t.id == parseInt(interestedTeamId??""))

  const setTeamId = (teamId: number | undefined) => {
    if (teamId) {
      navigate(`/${seasonId}/${teamId}`)
    } else {
      navigate(`/${seasonId}`)
    }
  }

  return (
    <Grid container
           alignItems={"center"}
    >
      <Grid>
        <Button variant={"text"}
                color={"inherit"}
                size={"large"}
                sx={{alignItems: "flex-start"}}
                endIcon={interestedTeam ? <RemoveCircleIcon onClick={(e) => {
                  e.stopPropagation()
                  setTeamId(undefined)
                }}></RemoveCircleIcon> : undefined}
                onClick={(event) => setAnchorEl(event.currentTarget)}>
          {interestedTeam?.name ?? "Select Team"}
        </Button>
      </Grid>
      <Menu anchorEl={anchorEl}
            open={isOpen}
            onClose={() => setAnchorEl(null)}>
        {teams?.filter((t) => t.id < 1000).map((t) => (
          <MenuItem key={t.name}
                    onClick={() => {
                      setTeamId(t.id)
                      setAnchorEl(null)
                    }}>
            {t.name}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  )
}
