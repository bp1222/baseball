import { Box, Button, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import GetTheme from "../colors";
import { useContext, useState } from "react";
import { AppStateContext } from "../state/context";

enum Tab {
  Schedule,
  Stats,
}

const TabLocation = {
  [Tab.Schedule]: '',
  [Tab.Stats]: 'stats',
}

const Team = () => {
  const [tab, setTab] = useState<Tab>(Tab.Schedule)

  const { state } = useContext(AppStateContext)
  const { teamId } = useParams()
  const team = state.teams.find((t) => t.id == parseInt(teamId ?? ""));
  const navigate = useNavigate()

  const makeButton = (text: string, location: Tab) => {
    const selected = tab == location
    const bgColor = selected ? "secondary.main" : grey[200]

    return (
      <Button
        onClick={() => {
          setTab(location)
          navigate(TabLocation[location])
        }}
        sx={{
          minWidth: "20%",
          border: 1,
          borderColor: 'secondary.dark',
          borderRadius: 4,
          bgcolor: bgColor,
          fontWeight: selected ? "bold" : "",
          ":hover": {
            bgcolor: grey[400]
          }
        }}>
        <Box>
          {text}
        </Box>
      </Button>
    )
  }

  return (
    <>
      <Box pb={2}>
        <Stack width={1} direction={"row"} display={"flex"} justifyContent={"center"} textAlign={"center"} spacing={2}>
          <>
            {makeButton("schedule", Tab.Schedule)}
            {makeButton("stats", Tab.Stats)}
          </>
        </Stack>
      </Box >
      <ThemeProvider theme={GetTheme(team?.id)}>
        <CssBaseline />
          <Outlet />
      </ThemeProvider>
    </>
  );
};

export default Team;
