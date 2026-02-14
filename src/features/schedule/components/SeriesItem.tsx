import { Grid, Typography } from "@mui/material"
import dayjs from "dayjs"

import { GameItem } from "./GameItem"
import { SeriesTeam } from "./SeriesItem/SeriesTeam"
import { useInterestedTeam } from "@/context/InterestedTeamContext"
import { GetSeriesResult, Series } from "@/types/Series"
import { DefaultSeriesResultColor, GetSeriesColors } from "@/types/Series/SeriesResult"
import { SeriesType } from "@/types/Series/SeriesType"

import { ResultBadge } from "./SeriesItem/ResultBadge"
import { SeriesBadge } from "./SeriesItem/SeriesBadge"
import { SeriesTeams } from "./SeriesItem/SeriesTeams"

type SeriesItemProps = {
  series: Series
  selectedDate?: dayjs.Dayjs
}

export const SeriesItem = ({ series, selectedDate }: SeriesItemProps) => {
  const interestedTeam = useInterestedTeam()

  const seriesResult = GetSeriesResult(series, interestedTeam)
  const { background, border } = interestedTeam
    ? GetSeriesColors(series.type, seriesResult)
    : DefaultSeriesResultColor

  return (
    <Grid
      container
      flexWrap="nowrap"
      border={1}
      borderRadius={1}
      borderColor={border}
      bgcolor={background}
      fontSize="small"
      position="relative"
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "35em" },
        minWidth: 0,
        flexGrow: 1,
        boxSizing: "border-box",
      }}
    >
      {interestedTeam && (
        <Grid
          position="absolute"
          sx={{
            top: 0,
            left: "-5px",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        >
          <ResultBadge result={seriesResult} type={series.type} />
        </Grid>
      )}

      {/* Team / opponent and series badge */}
      <Grid
        alignContent="center"
        minWidth={120}
        maxWidth={120}
        sx={{ flexShrink: 0 }}
      >
        <Grid container paddingTop={1} paddingBottom={1} justifyContent="center">
          <Grid>
            {interestedTeam ? (
              <SeriesTeam series={series} team={interestedTeam} />
            ) : (
              <SeriesTeams series={series} />
            )}
          </Grid>
          <Grid>
            <SeriesBadge type={series.type} />
          </Grid>
          {series.startDate != null && series.endDate != null && (
            <Grid paddingTop={0.5}>
              <Typography
                variant="caption"
                display="block"
                textAlign="center"
                color="text.secondary"
              >
                {dayjs(series.startDate).format("MMM D")} –{" "}
                {dayjs(series.endDate).format("MMM D")}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Game tiles — fills remaining width, wraps to next line when needed */}
      <Grid
        flexGrow={1}
        minWidth={0}
        justifyContent="flex-end"
        alignContent="center"
      >
        <Grid container justifyContent="flex-end" flexWrap="wrap">
          {series.games.map((g, index) => {
            const isPostseason = [
              SeriesType.WildCard,
              SeriesType.Division,
              SeriesType.League,
              SeriesType.World,
            ].includes(series.type)
            return (
              <GameItem
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
