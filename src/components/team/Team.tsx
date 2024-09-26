import { Box, Button, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import {useState} from "react";
import TeamSeries from "./TeamSeries.tsx";
import TeamStats from "./TeamStats.tsx";

enum Tab {
  Schedule,
  Stats,
}

export const Component = () => {
  const [tab, setTab] = useState<Tab>(Tab.Schedule);

  const makeButton = (text: string, loc: Tab) => {
    const selected = tab == loc;
    const bgColor = selected ? "secondary.main" : grey[200];

    return (
      <Button
        onClick={() => {
          setTab(loc)
        }}
        sx={{
          minWidth: "20%",
          border: 1,
          borderColor: "secondary.dark",
          borderRadius: 4,
          backgroundColor: bgColor,
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
      {tab == Tab.Schedule ? <TeamSeries /> : <TeamStats />}
    </>
  );
};
