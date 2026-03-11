/**
 * Modal Context - Centralized modal state management
 *
 * Modals are stacked: e.g. boxscore then player on top. Closing the player
 * returns to the boxscore; closing the boxscore closes to the page.
 *
 * Usage:
 *   const { openBoxscore, openPlayer, close } = useModal()
 *   openBoxscore(game)
 *   openPlayer(personId)
 */

import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

import { Game } from '@/types/Game'

// One item in the modal stack (bottom to top)
export type ModalStackItem = { type: 'boxscore'; data: Game } | { type: 'player'; data: number }

type ModalContextValue = {
  /** Stack of open modals (bottom to top). Empty = no modal. */
  stack: ModalStackItem[]
  /** Open the boxscore modal (replaces stack with just this modal) */
  openBoxscore: (game: Game) => void
  /** Open the player modal on top of the current stack (e.g. on top of boxscore) */
  openPlayer: (personId: number) => void
  /** Close the topmost modal; if stack becomes empty, returns focus to trigger */
  close: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

type ModalProviderProps = {
  children: ReactNode
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [stack, setStack] = useState<ModalStackItem[]>([])

  const openBoxscore = useCallback((game: Game) => {
    setStack([{ type: 'boxscore', data: game }])
  }, [])

  const openPlayer = useCallback((personId: number) => {
    setStack((prev) => [...prev, { type: 'player', data: personId }])
  }, [])

  const close = useCallback(() => {
    setStack((prev) => {
      return prev.slice(0, -1)
    })
  }, [])

  return <ModalContext.Provider value={{ stack, openBoxscore, openPlayer, close }}>{children}</ModalContext.Provider>
}

/**
 * Hook to access modal context
 * @throws Error if used outside ModalProvider
 */
export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

/**
 * Hook to get the modal stack and close (for AppModals component)
 */
export const useModalState = () => {
  const { stack, close } = useModal()
  return { stack, close }
}
