/**
 * Modal Context - Centralized modal state management
 *
 * Modals are stacked: e.g. boxscore then player on top. Closing the player
 * returns to the boxscore; closing the boxscore closes to the page.
 *
 * Usage:
 *   const { openBoxscore, openPlayer, close } = useModal()
 *   openBoxscore(game, buttonRef.current)
 *   openPlayer(personId)  // from inside boxscore – stacks on top
 */

import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react'

import { Game } from '@/types/Game'

// One item in the modal stack (bottom to top)
export type ModalStackItem =
  | { type: 'boxscore'; data: Game }
  | { type: 'player'; data: number }
  | { type: 'seasonWheelDemo' }

type ModalContextValue = {
  /** Stack of open modals (bottom to top). Empty = no modal. */
  stack: ModalStackItem[]
  /** Open the boxscore modal (replaces stack with just this modal) */
  openBoxscore: (game: Game, trigger?: HTMLElement | null) => void
  /** Open the player modal on top of the current stack (e.g. on top of boxscore) */
  openPlayer: (personId: number, trigger?: HTMLElement | null) => void
  /** Open the season wheel demo modal */
  openSeasonWheelDemo: (trigger?: HTMLElement | null) => void
  /** Close the topmost modal; if stack becomes empty, returns focus to trigger */
  close: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

type ModalProviderProps = {
  children: ReactNode
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [stack, setStack] = useState<ModalStackItem[]>([])
  const triggerRef = useRef<HTMLElement | null>(null)

  const openBoxscore = useCallback((game: Game, trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? null
    setStack([{ type: 'boxscore', data: game }])
  }, [])

  const openPlayer = useCallback((personId: number, _trigger?: HTMLElement | null) => {
    setStack((prev) => [...prev, { type: 'player', data: personId }])
  }, [])

  const openSeasonWheelDemo = useCallback((trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? null
    setStack([{ type: 'seasonWheelDemo' }])
  }, [])

  const close = useCallback(() => {
    setStack((prev) => {
      const next = prev.slice(0, -1)
      if (next.length === 0 && triggerRef.current) {
        requestAnimationFrame(() => {
          triggerRef.current?.focus()
          triggerRef.current = null
        })
      }
      return next
    })
  }, [])

  return (
    <ModalContext.Provider value={{ stack, openBoxscore, openPlayer, openSeasonWheelDemo, close }}>
      {children}
    </ModalContext.Provider>
  )
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
