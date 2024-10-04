import {Team} from "@bp1222/stats-api"
import memoize from "fast-memoize"

export const FindTeam = memoize((teams: Team[]|undefined, teamId: number | undefined): Team | undefined => {
  return teams?.find((t) => t.id == teamId)
})

