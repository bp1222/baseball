import { Box, Button, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

enum Tab {
  Schedule,
  Stats,
}

const TabLocation = {
  [Tab.Schedule]: "schedule",
  [Tab.Stats]: "stats",
};

const Team = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const makeButton = (text: string, loc: Tab) => {
    const selected = location.pathname.endsWith(TabLocation[loc]);
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
        <Box>
          {text}
        </Box>
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
      <Outlet />
    </>
  );
};

export default Team;
