import {GameStatus, GameStatusCode, Team} from "@bp1222/stats-api"
import {Grid2, Typography} from "@mui/material"
import {useContext} from "react"

import {SeriesType} from "../../models/Series.ts"
import {AppStateContext} from "../../state/Context.tsx"
import LabelPaper from "../../utils/LabelPaper.tsx"

type TeamSeriesRecordProps = {
  team: Team
}

const TeamSeriesRecord = ({ team }: TeamSeriesRecordProps) => {
  const { state } = useContext(AppStateContext)

  const regularSeasonSeries = state.seasonSeries
    ?.filter((s) => s.type == SeriesType.RegularSeason)
    ?.filter((s) => s.games
      .some((g) => g.teams.away.team.id == team?.id || g.teams.home.team.id == team?.id)
    )

  const seriesWins = regularSeasonSeries
    ?.filter((s) =>
      s.games.filter((g) => g.status.codedGameState == GameStatusCode.Final).length > 0 &&
      s.games.filter((g) =>
        g.teams.away.team.id == team?.id && g.teams.away.isWinner ||
        g.teams.home.team.id == team?.id && g.teams.home.isWinner
      ).length > s.games.length / 2)
    .length ?? 0

  const seriesLosses = regularSeasonSeries
    ?.filter((s) =>
      s.games.filter((g) => g.status.codedGameState == GameStatusCode.Final).length > 0 &&
      s.games.filter((g) =>
        g.teams.away.team.id == team?.id && g.teams.away.isWinner ||
        g.teams.home.team.id == team?.id && g.teams.home.isWinner
      ).length < s.games.length / 2)
    .length ?? 0

  const seriesTies = regularSeasonSeries
    ?.filter((s) =>
      s.games.filter((g) => g.status.codedGameState == GameStatusCode.Final).length > 0 &&
      s.games.filter((g) =>
        g.teams.away.team.id == team?.id && g.teams.away.isWinner ||
        g.teams.home.team.id == team?.id && g.teams.home.isWinner
      ).length == s.games.length / 2)
    .length ?? 0

  const seriesPct = ((seriesWins + (.5*seriesTies)) / (seriesWins + seriesLosses + seriesTies))
  return (
    <LabelPaper label={"Series Record"}>
      <Grid2 container
             display={"flex"}
              flexDirection={"column"}
             >
      <Grid2 container
             display={"flex"}
             flexDirection={"row"}
             justifyContent={"center"}
             justifyItems={"center"}
             textAlign={"center"}
             columns={3}>
        <Grid2 size={1}>
          <Typography fontSize={"xx-large"}>{seriesWins}</Typography>
        </Grid2>
        <Grid2 size={1}>
          <Typography fontSize={"xx-large"}>{seriesLosses}</Typography>
        </Grid2>
        <Grid2 size={1}>
          <Typography fontSize={"xx-large"}>{seriesTies}</Typography>
        </Grid2>
      </Grid2>
        <Grid2 container
               display={"flex"}
               flexDirection={"row"}
               justifyContent={"center"}
               justifyItems={"center"}
               textAlign={"center"}
               columns={3}>
          <Grid2 size={1}>
            <Typography fontSize={"smaller"}>{"Series Wins"}</Typography>
          </Grid2>
          <Grid2 size={1}>
            <Typography fontSize={"smaller"}>{"Series Losses"}</Typography>
          </Grid2>
          <Grid2 size={1}>
            <Typography fontSize={"smaller"}>{"Series Ties"}</Typography>
          </Grid2>
        </Grid2>
      </Grid2>
      <Grid2 container
             display={"flex"}
             flexDirection={"row"}
             justifyContent={"center"}
             justifyItems={"center"}
             textAlign={"center"}
             columns={1}>
        {isNaN(seriesPct) ? <></> :
          <Grid2 size={1} paddingBottom={1}>
            <Typography fontSize={"smaller"} display={"inline"} fontWeight={"bold"}>{seriesPct.toFixed(3).substring(1)}</Typography>
            <Typography fontSize={"smaller"} display={"inline"}> Series Winning Percentage</Typography>
          </Grid2>
        }
      </Grid2>
    </LabelPaper>
  )
}

export default TeamSeriesRecord