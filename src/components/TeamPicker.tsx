import {useContext, useEffect, useState} from "react";
import { MLBTeam } from "@bp1222/stats-api";
import { MenuItem, Button, Menu, Typography } from "@mui/material";
import { AppStateContext } from "../state/Context";
import { FindTeam } from "../utils/team";
import { useNavigate, useParams } from "react-router-dom";

const TeamPicker = () => {
  const { state } = useContext(AppStateContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [teams, setTeams] = useState<MLBTeam[]>([]);
  const { seasonId, teamId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setTeams(state.teams ?? []);
  }, [state.teams])

  const handleTeamSelect = (team: MLBTeam) => {
    setAnchorEl(null);
    navigate(seasonId + "/" + team.id);
  };

  const team = FindTeam(state.teams!, teamId);

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
        {teams?.map((v) => (
          <MenuItem onClick={() => handleTeamSelect(v)} key={v.teamCode}>
            {v.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default TeamPicker;
