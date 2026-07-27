import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SeriesDayBoard } from '../components/SeriesDayBoard'
import { localToday } from '../lib/series'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const [focusDate, setFocusDate] = useState(localToday)
  return <SeriesDayBoard focusDate={focusDate} onFocusDateChange={setFocusDate} />
}
