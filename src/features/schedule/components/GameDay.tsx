import { Box } from "@mui/material"
import { PickersDay } from "@mui/x-date-pickers/PickersDay"
import dayjs, { type Dayjs } from "dayjs"

type GameDayProps = React.ComponentProps<typeof PickersDay> & {
  /** Set of date strings "YYYY-MM-DD" that have at least one game */
  datesWithGames?: Set<string>
}

/**
 * Calendar day that shows a dot indicator when the date has games.
 * Used in the date picker to help users discover game days.
 */
export function GameDay({
  datesWithGames,
  day,
  ...pickersDayProps
}: GameDayProps) {
  const dateKey = dayjs(day as Dayjs).format("YYYY-MM-DD")
  const hasGame = datesWithGames?.has(dateKey) ?? false

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <PickersDay day={day} {...pickersDayProps} />
      {hasGame && (
        <Box
          sx={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            width: 5,
            height: 5,
            borderRadius: "50%",
            backgroundColor: "primary.main",
            pointerEvents: "none",
          }}
          aria-hidden
        />
      )}
    </Box>
  )
}
