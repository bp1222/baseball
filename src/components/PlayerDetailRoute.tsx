import { PlayerDetailModal } from './PlayerDetailModal'

type PlayerDetailRouteProps = {
  personId: number
  defaultSeason: string
  onClose: () => void
}

/** Route-driven player stats modal (same overlay pattern as game detail). */
export function PlayerDetailRoute({
  personId,
  defaultSeason,
  onClose,
}: PlayerDetailRouteProps) {
  return (
    <PlayerDetailModal
      personId={personId}
      open
      onClose={onClose}
      defaultSeason={defaultSeason}
    />
  )
}
