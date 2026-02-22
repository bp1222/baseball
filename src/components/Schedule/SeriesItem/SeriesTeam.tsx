import { Grid, Typography } from '@mui/material'

import { GetTeamImage } from '@/components/Shared/GetTeamImage'
import { useTeam } from '@/queries/team'
import { GetSeriesHomeAway, GetSeriesWins, Series } from '@/types/Series'
import { SeriesHomeAway } from '@/types/Series/SeriesHomeAway'
import { SeriesType } from '@/types/Series/SeriesType'
import { Team } from '@/types/Team'

type SeriesTeamProps = {
  series: Series
  team: Team
}

export const SeriesTeam = ({ series, team }: SeriesTeamProps) => {
  let againstId: number | undefined
  if (series.games[0].away.teamId !== team.id) {
    againstId = series.games[0].away.teamId
  } else {
    againstId = series.games[0].home.teamId
  }

  const { data: against } = useTeam(againstId)
  const homeaway = GetSeriesHomeAway(series, team)
  const teamWins = GetSeriesWins(series, team)
  const againstWins = against ? GetSeriesWins(series, against) : 0
  const isPostseason = [SeriesType.WildCard, SeriesType.Division, SeriesType.League, SeriesType.World].includes(
    series.type,
  )

  return (
    <Grid container flexDirection="column" alignItems="center" sx={{ minWidth: 0 }}>
      <Grid marginBottom={-0.5}>{GetTeamImage(against)}</Grid>
      <Grid sx={{ minWidth: 0, width: '100%', textAlign: 'center' }}>
        <Typography display="inline" variant="caption" sx={{ fontSize: '0.65rem' }}>
          {homeaway === SeriesHomeAway.Home
            ? 'vs '
            : homeaway === SeriesHomeAway.Away
              ? '@ '
              : isPostseason
                ? series.games[0].away.teamId === team.id
                  ? '@ '
                  : 'vs '
                : 'against '}
        </Typography>
        <Typography
          display="inline"
          variant="caption"
          noWrap
          sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {against?.franchiseName}
        </Typography>
      </Grid>
      <Grid sx={{ minWidth: 0, width: '100%', textAlign: 'center' }}>
        <Typography variant="body2" fontWeight="bold" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {against?.teamName?.toUpperCase()}
        </Typography>
      </Grid>
      {isPostseason && (
        <Grid>
          <Typography variant="body2" fontWeight={600}>
            {teamWins}–{againstWins}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}
