import { Box, Button, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import GetTheme from "../colors";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppStateContext } from "../state/Context";
import { MlbApi, MLBSchedule, MLBScheduleFromJSON, MLBScheduleToJSON } from "../services/MlbApi";

enum Tab {
  Schedule,
  Stats,
}

const TabLocation = {
  [Tab.Schedule]: "",
  [Tab.Stats]: "stats",
};

const api = new MlbApi();

const Team = () => {
  const { state } = useContext(AppStateContext);
  const { teamId, seasonId } = useParams();

  const [tab, setTab] = useState<Tab>(Tab.Schedule);
  const [schedule, setSchedule] = useState<MLBSchedule>({});

  const team = state.teams.find((t) => t.id == parseInt(teamId ?? ""));
  const season = state.seasons.find((s) => s.seasonId == seasonId);

  const navigate = useNavigate();


  const getSchedule = useCallback(async () => {
    if (team?.id == undefined) return;
    if (season?.seasonId == undefined) return;

    let schedule: MLBSchedule|null = null

    const seasonIdNum = parseInt(season.seasonId!)
    const seasonStorageKey = "mlbSeason:" + seasonIdNum + ":" + team.id!
    if (seasonIdNum < (new Date().getFullYear())) {
      const scheduleStr = localStorage.getItem(seasonStorageKey)
      if (scheduleStr != null) {
        schedule = JSON.parse(scheduleStr)
      }
    }

    if (schedule == null) {
      schedule = await api.getSchedule({
        sportId: 1,
        teamId: team.id,
        startDate: season.springStartDate ?? season.preSeasonStartDate,
        endDate: season.postSeasonEndDate,
      });
    }

    if (seasonIdNum < (new Date().getFullYear())) {
      localStorage.setItem(seasonStorageKey, JSON.stringify(schedule))
    }

    setSchedule(schedule);
  }, [season, team]);

  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  const makeButton = (text: string, location: Tab) => {
    const selected = tab == location;
    const bgColor = selected ? "secondary.main" : grey[200];

    return (
      <Button
        onClick={() => {
          setTab(location);
          navigate(TabLocation[location]);
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
            {makeButton("schedule", Tab.Schedule)}
            {makeButton("stats", Tab.Stats)}
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
