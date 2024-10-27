import {Box, Button, Grid2} from "@mui/material"
import { grey } from "@mui/material/colors"
import {useState} from "react"

import TeamSeries from "./TeamSeries.tsx"
import TeamStats from "./TeamStats.tsx"

enum Tab {
  Schedule,
  Stats,
}

export const Component = () => {
  const [tab, setTab] = useState<Tab>(Tab.Schedule)

  const makeButton = (text: string, loc: Tab) => {
    const selected = tab == loc
    const bgColor = selected ? "secondary.main" : grey[200]

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
    )
  }

  const isStatsTab = tab == Tab.Stats

  return (
    <Grid2 container
           flexDirection={"column"}>

      <Grid2 container
             display={{sm: "flex", lg: "none"}}
             flexGrow={1}
             flexDirection={"row"}
             justifyContent={"center"}
             textAlign={"center"}
             spacing={2}
             paddingBottom={2}>
        {makeButton("schedule", Tab.Schedule)}
        {makeButton("stats", Tab.Stats)}
      </Grid2>

      <Grid2 container
             justifyContent={"center"}
             columns={{xs: 1, lg: 3}}>

        <Grid2 display={{xs: isStatsTab ? "none" : "", lg: "block"}} size={2}>
          <TeamSeries />
        </Grid2>

        <Grid2 paddingLeft={{xs: 0, lg: 1}} display={{xs: isStatsTab ? "block" : "none", lg: "block"}} size={1} maxWidth={450}>
          <TeamStats />
        </Grid2>
      </Grid2>
    </Grid2>
  )
}
