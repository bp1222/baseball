import { useContext, useState } from "react";
import { MLBTeam } from "../services/MlbApi/models";
import { MenuItem, Button, Menu, Typography } from "@mui/material";
import { AppStateAction, AppStateContext } from "../AppContext";
import { useNavigate } from "react-router-dom";

function TeamPicker() {
  const { state, dispatch } = useContext(AppStateContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const navigate = useNavigate();

  const handleTeamSelect = (team: MLBTeam) => {
    dispatch({
      type: AppStateAction.Team,
      team: team,
    });
    setAnchorEl(null);

    navigate("/schedule/" + team.id);
  };

  return (
    <>
      <Button
        id="team-selection-button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        color="inherit"
      >
        <Typography>
          {state.team?.name ? state.team?.name : "Select Team"}
        </Typography>
      </Button>
      <Menu
        id="team-selection-menu"
        open={anchorEl != null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {state.teams?.map((v) => (
          <MenuItem onClick={() => handleTeamSelect(v)} key={v.teamCode}>
            {v.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default TeamPicker;
