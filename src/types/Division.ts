import { Division as MLBDivision } from '@bp1222/stats-api'

export type Division = {
  id: number
  name: string
  abbreviation?: string
}

export const DivisionFromMLBDivision = (division: MLBDivision): Division => ({
  id: division.id,
  name: division.name,
  abbreviation: division.abbreviation,
})
