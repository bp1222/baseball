import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/season/$year')({
  component: SeasonLayout,
})

function SeasonLayout() {
  return <Outlet />
}
