import {Grid, Typography} from "@mui/material"

import {useAppStateUtil} from "@/state"
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
  const {getTeam} = useAppStateUtil()
  const homeaway = GetSeriesHomeAway(series, team)

  let against: Team | undefined
  if (series.games[0].away.teamId != team.id) {
    against = getTeam(series.games[0].away.teamId)
  } else {
    against = getTeam(series.games[0].home.teamId)
  }

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
