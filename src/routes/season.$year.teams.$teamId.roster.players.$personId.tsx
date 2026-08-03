import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlayerDetailRoute } from '../components/PlayerDetailRoute'

export const Route = createFileRoute(
  '/season/$year/teams/$teamId/roster/players/$personId',
)({
  component: TeamRosterPlayerModalRoute,
})

function TeamRosterPlayerModalRoute() {
  const { year, teamId, personId: personIdParam } = Route.useParams()
  const navigate = useNavigate()
  const personId = Number(personIdParam)

  return (
    <PlayerDetailRoute
      personId={personId}
      defaultSeason={year}
      onClose={() => {
        // `..` only strips `$personId`, leaving a bare `/players` segment.
        void navigate({
          to: '/season/$year/teams/$teamId/roster',
          params: { year, teamId },
          resetScroll: false,
        })
      }}
    />
  )
}
