import {Box, Stack} from "@mui/material"
import {
  GetSeriesGameResult,
  GetSeriesResult,
  Series,
} from "../../models/Series.ts"
import { useContext } from "react"
import { AppStateContext } from "../../state/Context.tsx"
import { Team } from "@bp1222/stats-api"
import {ResultBadge} from "./ResultBadge.tsx"
import {SeriesBadge} from "./SeriesBadge.tsx"
import {SeriesTeams} from "./SeriesTeams.tsx"
import {SeriesGame} from "./SeriesGame.tsx"
import {FindTeam} from "../../utils/findTeam.ts";
import {DefaultSeriesResultColor, GetSeriesColors} from "./colors.ts";
import dayjs from "../../utils/dayjs.ts";

type SeriesItemProps = {
  series: Series

  // If we're interested in a specific team, we'll highlight the series with respect to them
  // If not, we will highlight scores based on the result
  interested?: Team

  // For outlining a day
  selectedDate?: dayjs.Dayjs
}

const SeriesItem = ({ series, interested, selectedDate }: SeriesItemProps) => {
  const { state } = useContext(AppStateContext)
  const seriesResult = GetSeriesResult(series, interested)
  const {background, border} = interested ? GetSeriesColors(series.type, seriesResult) : DefaultSeriesResultColor

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
          <ResultBadge result={seriesResult} type={series.type} />
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
        {series.games.map((g) => (
          <SeriesGame
            key={g.gamePk}
            result={GetSeriesGameResult(g, interested)}
            game={g}
            home={FindTeam(state.teams, g.teams?.home?.team?.id)!}
            away={FindTeam(state.teams, g.teams?.away?.team?.id)!}
            interested={interested}
            selectedDate={selectedDate}
          />
        ))}
      </Stack>
    </Stack>
  )
}
export default SeriesItem
