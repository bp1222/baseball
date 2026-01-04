import {Grid, Typography} from "@mui/material"

import {useTeam} from "@/queries/team.ts"
import {GetSeriesHomeAway, Series} from "@/types/Series.ts"
import {SeriesHomeAway} from "@/types/Series/SeriesHomeAway.ts"
import {SeriesType} from "@/types/Series/SeriesType.ts"
import {Team} from "@/types/Team.ts"
import {GetTeamImage} from "@/utils/GetTeamImage.tsx"

type SeriesTeamProps = {
  series: Series
  team: Team
}

export const SeriesTeam = ({series, team}: SeriesTeamProps) => {
  let againstId: number | undefined
  if (series.games[0].away.teamId != team.id) {
    againstId = series.games[0].away.teamId
  } else {
    againstId = series.games[0].home.teamId
  }

  const { data: against } = useTeam(againstId)
  const homeaway = GetSeriesHomeAway(series, team)

  return (
    <Grid container
          flexDirection={"column"}
          alignItems={"center"}>
      <Grid marginBottom={-.5}>
        {GetTeamImage(against)}
      </Grid>
      <Grid>
        <Typography display={"inline"}
                    fontSize={"xx-small"}>
          {homeaway == SeriesHomeAway.Home
            ? "vs "
            : homeaway == SeriesHomeAway.Away
              ? "@ "
              : [SeriesType.WildCard, SeriesType.Division, SeriesType.League, SeriesType.World].indexOf(series.type) > 0
                ? (series.games[0].away.teamId == team.id ? "@ " : "vs ") : "against "}
        </Typography>
        <Typography display={"inline"}
                    fontSize={"x-small"}
                    noWrap>
          {against?.franchiseName}
        </Typography>
      </Grid>
      <Grid>
        <Typography
          fontSize={"smaller"}
          fontStyle={"bold"}>
          {against?.teamName?.toUpperCase()}
        </Typography>
      </Grid>
    </Grid>
  )
}
