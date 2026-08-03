import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlayerDetailRoute } from '../components/PlayerDetailRoute'
import { validateGameDetailSearch } from '../lib/gameDetailSearch'

export const Route = createFileRoute('/season/$year/games/$gamePk/players/$personId')({
  component: SeasonGamePlayerModalRoute,
})

function SeasonGamePlayerModalRoute() {
  const { year, gamePk, personId: personIdParam } = Route.useParams()
  const navigate = useNavigate()
  const personId = Number(personIdParam)

  return (
    <PlayerDetailRoute
      personId={personId}
      defaultSeason={year}
      onClose={() => {
        // `..` only strips `$personId`, leaving a bare `/players` segment.
        void navigate({
          to: '/season/$year/games/$gamePk',
          params: { year, gamePk },
          search: (prev) => validateGameDetailSearch(prev),
          resetScroll: false,
        })
      }}
    />
  )
}
