import { Button, Stack, TextField } from '@mui/material'

type DateNavigationProps = {
  focusDate: string
  gameDates: string[]
  onChange: (date: string) => void
}

export function DateNavigation({ focusDate, gameDates, onChange }: DateNavigationProps) {
  const idx = gameDates.indexOf(focusDate)
  const prev = idx > 0 ? gameDates[idx - 1] : findPrev(gameDates, focusDate)
  const next =
    idx >= 0 && idx < gameDates.length - 1
      ? gameDates[idx + 1]
      : findNext(gameDates, focusDate)

  const today = new Date()
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  return (
    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
      <TextField
        type="date"
        size="small"
        label="Select date"
        value={focusDate}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 200 }}
      />
      <Stack
        direction="row"
        spacing={1}
        sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Button
          size="small"
          variant="outlined"
          disabled={!prev}
          onClick={() => prev && onChange(prev)}
        >
          Prev game day
        </Button>
        <Button size="small" variant="outlined" onClick={() => onChange(todayIso)}>
          Today
        </Button>
        <Button
          size="small"
          variant="outlined"
          disabled={!next}
          onClick={() => next && onChange(next)}
        >
          Next game day
        </Button>
      </Stack>
    </Stack>
  )
}

function findPrev(dates: string[], focus: string): string | undefined {
  for (let i = dates.length - 1; i >= 0; i--) {
    if (dates[i]! < focus) return dates[i]
  }
  return undefined
}

function findNext(dates: string[], focus: string): string | undefined {
  for (const d of dates) {
    if (d > focus) return d
  }
  return undefined
}
