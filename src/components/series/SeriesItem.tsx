import {Box, Stack} from "@mui/material"
import {
  Series,
} from "../../models/Series.ts"
import { useContext } from "react"
import { AppStateContext } from "../../state/Context.tsx"
import { MLBTeam } from "@bp1222/stats-api"
import {grey } from "@mui/material/colors"
import {ResultBadge} from "./ResultBadge.tsx"
import {SeriesBadge} from "./SeriesBadge.tsx"
import {SeriesTeams} from "./SeriesTeams.tsx"
import {SeriesGame} from "./SeriesGame.tsx"
import {FindTeam} from "../../utils/findTeam.ts";
import {DefaultSeriesResultColor, GetSeriesColors} from "./colors.ts";

type SeriesItemProps = {
  series: Series

  // If we're interested in a specific team, we'll highlight the series with respect to them
  // If not, we will highlight scores based on the result
  interested?: MLBTeam
}

const SeriesItem = ({ series, interested }: SeriesItemProps) => {
  const { state } = useContext(AppStateContext)
  const {background, border} = interested ? GetSeriesColors(series.type, series.result) : DefaultSeriesResultColor

  return (
    <Stack
      direction={"row"}
      height={1}
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: border,
        backgroundColor: background,
        fontSize: "small",
      }}
    >
      {interested ? (
        <Stack
          position="absolute"
          direction={{xs: "column", sm: "row"}}
          display={"flex"}
          mt={-0.8}
          ml={-1.5}
          padding="10"
        >
          <ResultBadge result={series.result} type={series.type} />
          <SeriesBadge type={series.type} />
        </Stack>
      ) : ''}
      <Box alignContent={"center"} minWidth={{ xs: "40%", md: "35%" }}>
        <SeriesTeams
          series={series}
          interested={interested}
        />
      </Box>

      <Stack
        direction="row"
        width={"fill-available"}
        justifyContent={"end"}
        alignContent={"center"}
        flexWrap={"wrap"}
      >
        {series.games.map((sg) => (
          <SeriesGame
            key={sg.game.gamePk}
            result={sg.result}
            game={sg.game}
            home={FindTeam(state.teams, sg.game.teams?.home?.team?.id)!}
            away={FindTeam(state.teams, sg.game.teams?.away?.team?.id)!}
            interested={interested}
          />
        ))}
      </Stack>
    </Stack>
  )
}
export default SeriesItem
