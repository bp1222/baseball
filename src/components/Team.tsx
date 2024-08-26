import { Box, Button, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import GetTheme from "../colors";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppStateContext } from "../state/Context";
import { MlbApi, MLBSchedule } from "../services/MlbApi";
import LoadCachedData from "../services/caching";

enum Tab {
  Schedule,
  Stats,
}

const TabLocation = {
  [Tab.Schedule]: "schedule",
  [Tab.Stats]: "stats",
};

const api = new MlbApi();

const Team = () => {
  const { state } = useContext(AppStateContext);
  const { teamId, seasonId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const [schedule, setSchedule] = useState<MLBSchedule>();

  const team = state.teams.find((t) => t.id == parseInt(teamId ?? ""));
  const season = state.seasons.find((s) => s.seasonId == seasonId);

  const getSchedule = useCallback(async () => {
    if (team?.id == undefined) return;
    if (season?.seasonId == undefined) return;

    let schedule: MLBSchedule | null = null

    const seasonIdNum = parseInt(season.seasonId!)
    const seasonStorageKey = "mlbSeason:" + seasonIdNum + ":" + team.id!

    schedule = await LoadCachedData<MLBSchedule>(seasonStorageKey, (seasonIdNum < (new Date().getFullYear())), () => api.getSchedule({
      sportId: 1,
      teamId: team.id,
      startDate: season.springStartDate ?? season.preSeasonStartDate,
      endDate: season.postSeasonEndDate,
    }))

    if (schedule) {
      setSchedule(schedule);
    }
  }, [season, team]);

  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  const makeButton = (text: string, loc: Tab, selected: boolean) => {
    const bgColor = selected ? "secondary.main" : grey[200];

    return (
      <Button
        onClick={() => {
          navigate(TabLocation[loc]);
        }}
        sx={{
          minWidth: "20%",
          border: 1,
          borderColor: "secondary.dark",
          borderRadius: 4,
          bgcolor: bgColor,
          fontWeight: selected ? "bold" : "",
          ":hover": {
            bgcolor: grey[400],
          },
        }}
      >
        <Box>{text}</Box>
      </Button>
    );
  };

  return (
    <>
      <Box pb={2}>
        <Stack
          width={1}
          direction={"row"}
          display={"flex"}
          justifyContent={"center"}
          textAlign={"center"}
          spacing={2}
        >
          <>
            {makeButton("schedule", Tab.Schedule, location.pathname.endsWith(TabLocation[Tab.Schedule]))}
            {makeButton("stats", Tab.Stats, location.pathname.endsWith(TabLocation[Tab.Stats]))}
          </>
        </Stack>
      </Box>
      <ThemeProvider theme={GetTheme(team?.id)}>
        <CssBaseline />
        <Outlet context={{ schedule, team }} />
      </ThemeProvider>
    </>
  );
};

export default Team;
