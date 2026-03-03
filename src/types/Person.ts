import type { PersonStatsItem } from '@bp1222/stats-api'
import { Person as MLBPerson } from '@bp1222/stats-api'

import { Team, TeamFromMLBTeam } from '@/types/Team'

export type Position = {
  code?: string
  name?: string
  type?: string
  abbreviation?: string
}

export type CodeDescription = {
  code?: string
  description?: string
}

export type Person = {
  id: number
  fullName: string
  link?: string
  primaryNumber?: string
  primaryPosition?: Position
  currentTeam?: Team
  batSide?: CodeDescription
  pitchHand?: CodeDescription
  stats?: PersonStatsItem[]
}

export const PersonFromMLBPerson = (person: MLBPerson): Person => ({
  id: person.id,
  fullName: person.fullName,
  link: person.link,
  primaryNumber: person.primaryNumber,
  primaryPosition: person.primaryPosition
    ? {
        code: person.primaryPosition.code,
        name: person.primaryPosition.name,
        type: person.primaryPosition.type,
        abbreviation: person.primaryPosition.abbreviation,
      }
    : undefined,
  currentTeam: person.currentTeam ? TeamFromMLBTeam(person.currentTeam) : undefined,
  batSide: person.batSide ? { code: person.batSide.code, description: person.batSide.description } : undefined,
  pitchHand: person.pitchHand ? { code: person.pitchHand.code, description: person.pitchHand.description } : undefined,
  stats: person.stats,
})
