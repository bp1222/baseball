/**
 * App modals – boxscore and player modals rendered from modal stack.
 * Each modal is in its own file under modals/ for clarity.
 */

import { useModalState } from '@/context/ModalContext'

import { BoxscoreModal } from './BoxscoreModal'
import { PlayerModal } from './PlayerModal/PlayerModal'

/**
 * Renders the modal stack (e.g. boxscore with player on top).
 * Closing the top modal pops the stack.
 */
export const AppModals = () => {
  const { stack, close } = useModalState()

  return (
    <>
      {stack.map((item) => {
        if (item.type === 'boxscore') {
          return <BoxscoreModal key={`boxscore-${item.data.pk}`} game={item.data} onClose={close} />
        }
        if (item.type === 'player') {
          return <PlayerModal key={`player-${item.data}`} personId={item.data} onClose={close} />
        }
        return null
      })}
    </>
  )
}
