import {useContext, useState} from "react";
import { MLBTeam } from "@bp1222/stats-api";
import { MenuItem, Button, Menu, Typography } from "@mui/material";
import { AppStateContext } from "../state/Context";
import { useNavigate, useParams } from "react-router-dom";

const TeamPicker = () => {
  const { state } = useContext(AppStateContext);
  const { seasonId, teamId} = useParams();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleTeamSelect = (team: MLBTeam|null) => {
    setAnchorEl(null);
    if (team == null) {
      navigate(seasonId + "/");
    } else {
      navigate(seasonId + "/" + team.id);
    }
  };

  const team = state.teams?.find((t) => t.id == parseInt(teamId ?? ""));

  return (
    <>
      <Button
        id="team-selection-button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        color="inherit"
      >
        <Typography>{team?.name ? team.name : "Select Team"}</Typography>
      </Button>
      <Menu
        id="team-selection-menu"
        open={anchorEl != null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleTeamSelect(null)}>Clear</MenuItem>
        {state.teams?.map((v) => (
          <MenuItem onClick={() => handleTeamSelect(v)} key={v.teamCode}>
            {v.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default TeamPicker;
