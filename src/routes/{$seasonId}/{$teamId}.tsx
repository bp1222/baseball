import { Box, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { SeriesCardSkeleton, SeriesList } from "@/features/schedule"
import { SeriesRecordSkeleton, TeamStats } from "@/features/team"
import { StandingsSkeleton } from "@/features/standings"
import { useSchedule } from "@/queries/schedule"
import { scheduleOptions } from "@/queries/schedule"
import { seasonsOptions } from "@/queries/season"
import { teamsOptions } from "@/queries/team"

type TeamViewTab = "schedule" | "stats"

const TeamComponent = () => {
  const { seasonId, teamId: teamIdParam } = Route.useParams()
  const interestedTeamId =
    teamIdParam != null ? Number(teamIdParam) : undefined
  const [narrowTab, setNarrowTab] = useState<TeamViewTab>("schedule")
  const { data: scheduleData, isPending: isSchedulePending } = useSchedule()
  let seasonSeries = scheduleData

  if (interestedTeamId != null && seasonSeries != null) {
    seasonSeries = seasonSeries.filter((s) =>
      s.games.some(
        (g) =>
          g.away.teamId === interestedTeamId ||
          g.home.teamId === interestedTeamId
      )
    )
  }

  if (isSchedulePending) {
    return (
      <Box sx={{ width: "100%", minWidth: 0, overflow: "hidden" }}>
        {/* Narrow: toggle + single panel */}
        <Box sx={{ display: { xs: "block", md: "none" }, width: "100%", minWidth: 0 }}>
          <ToggleButtonGroup
            value={narrowTab}
            exclusive
            onChange={(_, v) => v != null && setNarrowTab(v)}
            aria-label="View schedule or team stats"
            fullWidth
            sx={{ mb: 1.5 }}
          >
            <ToggleButton value="schedule" aria-label="Schedule">Schedule</ToggleButton>
            <ToggleButton value="stats" aria-label="Team stats">Team stats</ToggleButton>
          </ToggleButtonGroup>
          {narrowTab === "schedule" && (
            <Box sx={{ paddingLeft: 2, minWidth: 0, overflow: "hidden" }}>
              <Grid container width="100%" minWidth={0} spacing={1.5} columns={{ xs: 1, md: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Grid key={i} container size={1} justifyContent="center" flexGrow={1} minWidth={0}>
                    <SeriesCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          {narrowTab === "stats" && (
            <Box sx={{ minWidth: 0 }}>
              <Grid container justifyContent="center" flexGrow={1}>
                <Grid>
                  <SeriesRecordSkeleton />
                  <StandingsSkeleton label="Division Standings" rows={5} />
                  <StandingsSkeleton label="League Standings" rows={6} />
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        {/* Wide: two columns */}
        <Grid
          container
          justifyContent="center"
          sx={{ width: "100%", minWidth: 0, display: { xs: "none", md: "flex" } }}
        >
          <Grid
            container
            flexGrow={1}
            columnSpacing={2}
            columns={3}
            sx={{ flexDirection: "row", width: "100%", maxWidth: "100%", minWidth: 0 }}
          >
            <Grid size={2} sx={{ minWidth: 0, overflow: "hidden", paddingLeft: 2 }}>
              <Grid container width="100%" minWidth={0} spacing={1.5} columns={2}>
                {[1, 2, 3].map((i) => (
                  <Grid key={i} container size={1} justifyContent="center" flexGrow={1} minWidth={0}>
                    <SeriesCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid size={1} sx={{ minWidth: 0 }}>
              <Grid container justifyContent="center" flexGrow={1}>
                <Grid>
                  <SeriesRecordSkeleton />
                  <StandingsSkeleton label="Division Standings" rows={5} />
                  <StandingsSkeleton label="League Standings" rows={6} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const emptyMessage = (
    <Box color="text.secondary" padding={2}>
      No series found for this team.
    </Box>
  )

  return (
    <Box sx={{ width: "100%", minWidth: 0, overflow: "hidden" }}>
      {/* Narrow: toggle + single panel */}
      <Box sx={{ display: { xs: "block", md: "none" }, width: "100%", minWidth: 0 }}>
        <ToggleButtonGroup
          value={narrowTab}
          exclusive
          onChange={(_, v) => v != null && setNarrowTab(v)}
          aria-label="View schedule or team stats"
          fullWidth
          sx={{ mb: 1.5 }}
        >
          <ToggleButton value="schedule" aria-label="Schedule">Schedule</ToggleButton>
          <ToggleButton value="stats" aria-label="Team stats">Team stats</ToggleButton>
        </ToggleButtonGroup>
        {narrowTab === "schedule" && (
          <Box sx={{ paddingLeft: 2, minWidth: 0, overflow: "hidden" }}>
            {(seasonSeries?.length ?? 0) === 0 ? emptyMessage : <SeriesList series={seasonSeries!} />}
          </Box>
        )}
        {narrowTab === "stats" && (
          <Box sx={{ minWidth: 0 }}>
            <TeamStats seasonId={seasonId} teamId={interestedTeamId} />
          </Box>
        )}
      </Box>

      {/* Wide: two columns */}
      <Grid
        container
        justifyContent="center"
        sx={{ width: "100%", minWidth: 0, display: { xs: "none", md: "flex" } }}
      >
        {(seasonSeries?.length ?? 0) === 0 ? (
          emptyMessage
        ) : (
          <Grid
            container
            flexGrow={1}
            columnSpacing={2}
            columns={3}
            sx={{ flexDirection: "row", width: "100%", maxWidth: "100%", minWidth: 0 }}
          >
            <Grid size={2} sx={{ minWidth: 0, overflow: "hidden", paddingLeft: 2 }}>
              <SeriesList series={seasonSeries!} />
            </Grid>
            <Grid size={1} sx={{ minWidth: 0 }}>
              <TeamStats seasonId={seasonId} teamId={interestedTeamId} />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export const Route = createFileRoute("/{$seasonId}/{$teamId}")({
  loader: async ({
    context: { queryClient, defaultSeason },
    params: { seasonId },
  }) => {
    const seasons = await queryClient.ensureQueryData(seasonsOptions)
    const season = seasons.find((s) => s.seasonId === (seasonId ?? defaultSeason))
    await Promise.all([
      queryClient.ensureQueryData(teamsOptions(seasonId ?? defaultSeason)),
      season
        ? queryClient.ensureQueryData(scheduleOptions(season))
        : Promise.resolve(),
    ])
  },
  component: TeamComponent,
})