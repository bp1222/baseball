import { Grid, Typography } from '@mui/material'
import dayjs from 'dayjs'

import { useInterestedTeam } from '@/context/InterestedTeamContext'
import { GetSeriesResult } from '@/domain/series'
import { useCustomPalette } from '@/theme/useCustomPalette'
import { Series } from '@/types/Series'
import { SeriesType } from '@/types/Series/SeriesType'

import { GameTile } from './GameTile'
import { ResultBadge } from './SeriesItem/ResultBadge'
import { SeriesBadge } from './SeriesItem/SeriesBadge'
import { SeriesTeam } from './SeriesItem/SeriesTeam'
import { SeriesTeams } from './SeriesItem/SeriesTeams'
import { SpringLeagueIcon } from './SeriesItem/SpringLeagueIcon'

type SeriesItemProps = {
  series: Series
  selectedDate?: dayjs.Dayjs
}

export const SeriesItem = ({ series, selectedDate }: SeriesItemProps) => {
  const { seriesResult: seriesResultPalette, springTraining } = useCustomPalette()
  const interestedTeam = useInterestedTeam()

  const seriesResult = GetSeriesResult(series, interestedTeam ?? undefined)
  const seriesColors =
    series.type === SeriesType.SpringTraining
      ? springTraining[series.springLeague ?? 'grapefruit']
      : seriesResultPalette[seriesResult]

  return (
    <Grid
      container
      flexWrap="nowrap"
      border={1}
      borderRadius={1}
      borderColor={seriesColors.main}
      bgcolor={seriesColors.light}
      fontSize="small"
      position="relative"
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '35em' },
        minWidth: 0,
        flexGrow: 1,
        boxSizing: 'border-box',
        color: 'text.primary',
      }}
    >
      {interestedTeam && (
        <Grid
          position="absolute"
          sx={{
            top: 0,
            left: '-5px',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        >
          <ResultBadge result={seriesResult} type={series.type} />
        </Grid>
      )}

      <Grid alignContent="center" minWidth={120} maxWidth={120} sx={{ flexShrink: 0 }}>
        <Grid container paddingTop={1} paddingBottom={1} justifyContent="center">
          <Grid>
            {interestedTeam ? <SeriesTeam series={series} team={interestedTeam} /> : <SeriesTeams series={series} />}
          </Grid>
          <Grid container alignItems="center" justifyContent="center" gap={0.5} marginTop={0.5}>
            <SeriesBadge type={series.type} />
          </Grid>
          {series.startDate != null && series.endDate != null && (
            <Grid paddingTop={0.5}>
              <Typography variant="caption" display="block" textAlign="center" color="text.secondary">
                {dayjs(series.startDate).format('MMM D')} – {dayjs(series.endDate).format('MMM D')}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>

      {series.type === SeriesType.SpringTraining && series.springLeague && (
        <Grid sx={{ flexShrink: 0, alignSelf: 'center', paddingRight: 1 }}>
          <SpringLeagueIcon league={series.springLeague} />
        </Grid>
      )}

      <Grid flexGrow={1} minWidth={0} justifyContent="flex-end" alignContent="center">
        <Grid container justifyContent="flex-end" flexWrap="wrap">
          {series.games.map((g, index) => {
            const isPostseason = [
              SeriesType.WildCard,
              SeriesType.Division,
              SeriesType.League,
              SeriesType.World,
            ].includes(series.type)
            return (
              <GameTile
                key={g.pk}
                game={g}
                selectedDate={selectedDate}
                gameNumber={isPostseason ? index + 1 : undefined}
                gamesInSeries={isPostseason ? series.games.length : undefined}
              />
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}
