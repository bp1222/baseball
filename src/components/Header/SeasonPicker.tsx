import {Button, Grid, Menu, MenuItem} from "@mui/material"
import {useNavigate, useParams} from "@tanstack/react-router"
import {useState} from "react"

import {useSeasons} from "@/queries/season.ts"

export const SeasonPicker = () => {
  const { seasonId } = useParams({strict: false})
  const { data: seasons } = useSeasons()

  const navigate = useNavigate()

  const setSeason = (newSeasonId: string) => {
    void navigate({ to: "/{$seasonId}", params: { seasonId: newSeasonId } })
  }

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isOpen = Boolean(anchorEl)

  return (
    <Grid>
      <Button
        variant="text"
        color="inherit"
        size="large"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{ minHeight: 44, minWidth: 44 }}
      >
        {seasonId ? String(seasonId) : "Season"}
      </Button>
      <Menu anchorEl={anchorEl}
            open={isOpen}
            onClose={() => {
              setAnchorEl(null)
            }}>
        {seasons?.map((v) => (
          <MenuItem key={v.seasonId}
                    onClick={() => {
                      setSeason(v.seasonId)
                      setAnchorEl(null)
                    }}>
            {v.seasonId}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  )
}
