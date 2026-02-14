/**
 * Modal Context - Centralized modal state management
 *
 * Benefits:
 * - Single modal instance rendered at root level
 * - Centralized focus management (returns focus to trigger on close)
 * - Easy to add new modal types
 * - Better performance (no modal JSX in every list item)
 *
 * Usage:
 *   const { openBoxscore, close } = useModal()
 *   openBoxscore(game, buttonRef.current)
 */

import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react"

import { Game } from "@/types/Game"

// Modal types - extend this union as new modal types are added
type ModalType = "boxscore" | null

type ModalState =
  | { type: "boxscore"; data: Game }
  | { type: null; data: null }

type ModalContextValue = {
  /** Current modal state */
  state: ModalState
  /** Open the boxscore modal for a game */
  openBoxscore: (game: Game, trigger?: HTMLElement | null) => void
  /** Close the current modal */
  close: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

type ModalProviderProps = {
  children: ReactNode
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [state, setState] = useState<ModalState>({ type: null, data: null })
  const triggerRef = useRef<HTMLElement | null>(null)

  const openBoxscore = useCallback((game: Game, trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? null
    setState({ type: "boxscore", data: game })
  }, [])

  const close = useCallback(() => {
    setState({ type: null, data: null })
    // Return focus to the trigger element (accessibility)
    if (triggerRef.current) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus()
        triggerRef.current = null
      })
    }
  }, [])

  return (
    <ModalContext.Provider value={{ state, openBoxscore, close }}>
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
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}

/**
 * Hook to get just the modal state (for AppModals component)
 */
export const useModalState = () => {
  const { state, close } = useModal()
  return { state, close }
}
