import { Team } from "@bp1222/stats-api"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import {Box, Menu, MenuItem, Typography} from "@mui/material"
import {useContext, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"

import { AppStateContext } from "../../state/Context.tsx"

const TeamPicker = () => {
  const { state } = useContext(AppStateContext)
  const { seasonId, teamId} = useParams()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleTeamSelect = (team: Team|null) => {
    setAnchorEl(null)
    if (team == null) {
      navigate(seasonId + "/")
    } else {
      navigate(seasonId + "/" + team.id)
    }
  }

  const team = state.teams?.find((t) => t.id == parseInt(teamId ?? ""))

  return (
    <Box display={"flex"}
         alignItems={"center"}
         justifyContent={"flex-end"}>
      <Typography textAlign={"center"}
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  sx={{cursor: "pointer", float: "right"}}
                  textTransform={"uppercase"}
                  paddingRight={1}>
        {team?.name ? team.name : "Select Team"}
      </Typography>
      {teamId && <RemoveCircleIcon sx={{cursor: "pointer", float: "right"}}
                                   fontSize={"small"}
                                   onClick={() => handleTeamSelect(null)} />}

      <Menu open={anchorEl != null}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}>
        {state.teams?.map((v) => (
          <MenuItem key={v.teamCode}
                    onClick={() => handleTeamSelect(v)}>
            {v.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default TeamPicker
