import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTeam } from '../api/queries'
import { TeamRoster } from '../components/TeamRoster'
import { trackEvent } from '../lib/analytics'

export const Route = createFileRoute('/season/$year/teams/$teamId/roster')({
  component: TeamRosterPage,
})

function TeamRosterPage() {
  const { year, teamId: teamIdParam } = Route.useParams()
  const teamId = Number(teamIdParam)
  const navigate = useNavigate()
  const teamQuery = useTeam(year, teamId)
  const teamName = teamQuery.data?.name

  useEffect(() => {
    if (teamName == null) return
    trackEvent({
      name: 'view_team_roster',
      season: year,
      team_name: teamName,
    })
  }, [year, teamName])

  return (
    <>
      <TeamRoster
        year={year}
        teamId={teamId}
        onPlayerClick={(personId) => {
          void navigate({
            to: '/season/$year/teams/$teamId/roster/players/$personId',
            params: { year, teamId: teamIdParam, personId: String(personId) },
            resetScroll: false,
          })
        }}
      />
      <Outlet />
    </>
  )
}
