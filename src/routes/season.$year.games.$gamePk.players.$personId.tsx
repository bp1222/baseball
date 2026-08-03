import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlayerDetailRoute } from '../components/PlayerDetailRoute'

export const Route = createFileRoute('/season/$year/games/$gamePk/players/$personId')({
  component: SeasonGamePlayerModalRoute,
})

function SeasonGamePlayerModalRoute() {
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
