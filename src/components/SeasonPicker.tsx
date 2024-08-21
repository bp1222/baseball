import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { MLBSeason } from "../services/MlbApi";
import { useContext, useState } from "react";
import { AppStateContext } from "../state/Context";
import { useNavigate, useParams } from "react-router-dom";

const SeasonPicker = () => {
  const { state } = useContext(AppStateContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { seasonId } = useParams();
  const navigate = useNavigate();

  const handleSeasonSelect = (season: MLBSeason) => {
    setAnchorEl(null);
    navigate("" + season.seasonId);
  };

  return (
    <>
      <Button
        id="season-button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        color="inherit"
      >
        <Typography>
          {seasonId ? "Season: " + seasonId : "Select Season"}
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
    </>
  );
};

export default SeasonPicker;
