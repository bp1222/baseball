import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlayerDetailRoute } from '../components/PlayerDetailRoute'

export const Route = createFileRoute(
  '/season/$year/teams/$teamId/roster/players/$personId',
)({
  component: TeamRosterPlayerModalRoute,
})

function TeamRosterPlayerModalRoute() {
  const { year, personId: personIdParam } = Route.useParams()
  const navigate = useNavigate()
  const personId = Number(personIdParam)

  return (
    <PlayerDetailRoute
      personId={personId}
      defaultSeason={year}
      onClose={() => {
        void navigate({ to: '..', resetScroll: false })
      }}
    />
  )
}
