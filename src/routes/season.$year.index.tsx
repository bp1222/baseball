import { createFileRoute } from '@tanstack/react-router'

/** Day board lives in the year layout so it stays mounted under /games/$gamePk. */
export const Route = createFileRoute('/season/$year/')({
  component: () => null,
})
