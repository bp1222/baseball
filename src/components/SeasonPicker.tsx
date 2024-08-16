import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { Season } from "../services/client-api";
import { useContext, useState } from "react";
import { AppStateAction, AppStateContext } from "../AppContext";

function SeasonPicker() {
  const { state, dispatch } = useContext(AppStateContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSeasonSelect = (season: Season) => {
    dispatch({
      type: AppStateAction.Season,
      season: season,
    });
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="season-button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        color="inherit"
        sx={{
          float: "right",
          alignContent: "center",
        }}
        fullWidth
      >
        <Typography>
          {state.season?.seasonId
            ? "Season: " + state.season?.seasonId
            : "Select Season"}
        </Typography>
      </Button>
      <Menu
        id="season-menu"
        open={anchorEl != null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {state.seasons?.map((v) => (
          <MenuItem onClick={() => handleSeasonSelect(v)} key={v.seasonId}>
            {v.seasonId}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default SeasonPicker;
