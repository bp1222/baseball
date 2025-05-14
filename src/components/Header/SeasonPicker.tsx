import {Button, Grid, Menu, MenuItem} from "@mui/material"
import {useState} from "react"
import {useNavigate, useParams} from "react-router-dom"

import {useAppState} from "@/state"

export const SeasonPicker = () => {
  const {seasons} = useAppState()
  const {seasonId} = useParams()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const navigagte = useNavigate()
  const isOpen = Boolean(anchorEl)

  return (
    <Grid>
      <Button variant={"text"}
              color={"inherit"}
              size={"large"}
              onClick={(event) => setAnchorEl(event.currentTarget)}>
        {seasonId ? "Season: " + seasonId : "Select Season"}
      </Button>
      <Menu anchorEl={anchorEl}
            open={isOpen}
            onClose={() => {
              setAnchorEl(null)
            }}>
        {seasons?.map((v) => (
          <MenuItem key={v.seasonId}
                    onClick={() => {
                      navigagte("/" + v.seasonId)
                      setAnchorEl(null)
                    }}>
            {v.seasonId}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  )
}
