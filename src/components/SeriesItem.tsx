import { Box, Color, Stack, Typography } from "@mui/material";
import { Series, SeriesHomeAway, ResultColor, Result } from "../models/Series";
import { useContext } from "react";
import { AppStateContext } from "../AppContext";
import { Team } from "../services/client-api";
import SeriesGame from "./SeriesGame";

type SeriesItemProps = {
  series: Series
}

function SeriesItem({ series }: SeriesItemProps) {
  const { state } = useContext(AppStateContext)

  const findTeam = (id: number | undefined): Team | undefined => {
    return state.teams.find((t) => t.id == id)
  }

  const againstImage = "https://www.mlbstatic.com/team-logos/team-cap-on-light/" + series.against?.team?.id + ".svg"
  const againstTeam = findTeam(series.against?.team?.id)


  const resultBadge = () => {
    let badge = ""
    switch (series.result) {
      case Result.Win:
        badge = "win"
        break
      case Result.Loss:
        badge = "loss"
        break
      case Result.Sweep:
        badge = "sweep"
        break
      case Result.Swept:
        badge = "swept"
        break
      case Result.Tie:
        badge = "tie"
        break
    }

    if (badge.length > 0) {
      return (
        <Box sx={{
          position: "absolute",
          backgroundColor: ResultColor[series.result][300],
          border: 2,
          borderRadius: 2,
          borderColor: ResultColor[series.result][500],
          height: 11,
          marginTop: -1.5,
          marginLeft: -1,
          minWidth: 45,
        }}>
          <Typography
            color={"Background"}
            fontSize={"smaller"}
            lineHeight={1}
            letterSpacing={-.5}
            textAlign={"center"}
          >
            {badge.toUpperCase()}
          </Typography>
        </Box>
      )
    }
  }

  return (
    <Stack direction="row" sx={{
      border: 1,
      borderColor: ResultColor[series.result][300],
      borderRadius: 1,
      backgroundColor: ResultColor[series.result][50],
      fontSize: "small",
    }}>
      <Box minWidth={"35%"} justifyItems={"left"} alignContent={"center"} alignItems={"left"}>
        <Stack direction="row">
          {resultBadge()}
          <Box paddingLeft={.5} alignContent={"center"}>
            <img src={againstImage} height={24} width={24} />
          </Box>
          <Box paddingLeft={.3}>
            <Typography fontSize={"smaller"} textOverflow={"ellipsis"}>
              {series.homeaway == SeriesHomeAway.Home ? "vs" : (SeriesHomeAway.Away ? "@" : "against")} {againstTeam?.franchiseName}
            </Typography>
            <Typography noWrap fontSize={"Larger"} fontStyle={"bold"} letterSpacing={0} textOverflow={"clip"}>
              {againstTeam?.clubName?.toUpperCase()}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box minWidth={"65%"}>
        <Stack direction="row" justifyContent={"right"}>
          {series.games.map((sg) =>
            <SeriesGame sg={sg} home={findTeam(sg.game.teams?.home?.team?.id)} away={findTeam(sg.game.teams?.away?.team?.id)} />
          )}
        </Stack>
      </Box>
    </Stack>
  )
}

export default SeriesItem