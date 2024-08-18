import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { MLBSeason } from "../services/MlbApi";
import { useContext, useState } from "react";
import { AppStateAction, AppStateContext } from "../AppContext";

function SeasonPicker() {
  const { state, dispatch } = useContext(AppStateContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSeasonSelect = (season: MLBSeason) => {
    dispatch({
      type: AppStateAction.Season,
      season: season,
    });
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="season-button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        color="inherit"
      >
        <Typography>
          {state.season?.seasonId
            ? "Season: " + state.season?.seasonId
            : "Select Season"}
        </Typography>
      </Button>
      <Menu
        id="season-menu"
        anchorEl={anchorEl}
        open={anchorEl != null}
        onClose={() => setAnchorEl(null)}
      >
        {state.seasons?.map((v) => (
          <MenuItem onClick={() => handleSeasonSelect(v)} key={v.seasonId}>
            {v.seasonId}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default SeasonPicker;
