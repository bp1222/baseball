import {Box, Menu, MenuItem, Typography} from "@mui/material";
import { Season } from "@bp1222/stats-api";
import {useContext, useEffect, useState} from "react";
import { AppStateContext } from "../../state/Context.tsx";
import {useParams, useNavigate} from "react-router-dom";

const SeasonPicker = () => {
  const { state } = useContext(AppStateContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([])
  const {seasonId} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setSeasons(state.seasons ?? [])
  }, [state.seasons])

  const handleSeasonSelect = (season: Season) => {
    setAnchorEl(null);
    navigate("/" + season.seasonId)
  };

  return (
    <Box display={"flex"}
         alignItems={"center"}
         alignContent={"center"}
         justifyContent={"center"}>
      <Typography textAlign={"center"}
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  textTransform={"uppercase"}
                  sx={{cursor: "pointer"}}>
        {seasonId ? "Season: " + seasonId : "Select Season"}
      </Typography>
      <Menu anchorEl={anchorEl}
            open={anchorEl != null}
            onClose={() => setAnchorEl(null)}>
        {seasons?.map((v) => (
          <MenuItem key={v.seasonId}
                    onClick={() => handleSeasonSelect(v)}>
            {v.seasonId}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SeasonPicker;