/**
 * Interested Team Context
 *
 * Provides the currently selected team (from URL params) to all components.
 * This centralizes the pattern of reading teamId from params and looking up the team.
 *
 * Usage:
 *   const interestedTeam = useInterestedTeam()
 *   // Returns Team | undefined
 */

import { useParams } from "@tanstack/react-router"
import { createContext, ReactNode, useContext } from "react"

import { useTeam } from "@/queries/team"
import { Team } from "@/types/Team"

type InterestedTeamContextValue = {
  /** The currently selected team, or undefined if none selected */
  team: Team | undefined
  /** The team ID from URL params (may be defined even if team data hasn't loaded) */
  teamId: number | undefined
  /** Whether the team data is currently loading */
  isLoading: boolean
}

const InterestedTeamContext = createContext<InterestedTeamContextValue>({
  team: undefined,
  teamId: undefined,
  isLoading: false,
})

type InterestedTeamProviderProps = {
  children: ReactNode
}

export const InterestedTeamProvider = ({ children }: InterestedTeamProviderProps) => {
  const params = useParams({ strict: false })
  const teamId = params.teamId != null ? Number(params.teamId) : undefined
  const { data: team, isPending } = useTeam(teamId)

  return (
    <InterestedTeamContext.Provider
      value={{
        team,
        teamId,
        isLoading: isPending && teamId != null,
      }}
    >
      {children}
    </InterestedTeamContext.Provider>
  )
}

/**
 * Get the currently selected team from URL params
 * @returns Team | undefined
 */
export const useInterestedTeam = (): Team | undefined => {
  return useContext(InterestedTeamContext).team
}

/**
 * Get the full interested team context including loading state
 */
export const useInterestedTeamContext = (): InterestedTeamContextValue => {
  return useContext(InterestedTeamContext)
}
