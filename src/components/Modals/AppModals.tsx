/**
 * App modals – boxscore and player modals rendered from modal stack.
 * Each modal is in its own file under modals/ for clarity.
 */

import { useModalState } from '@/context/ModalContext'

import { BoxscoreModal } from './BoxscoreModal'
import { PlayerModal } from './PlayerModal'
import { SeasonWheelDemoModal } from './SeasonWheelDemoModal'

/**
 * Renders the modal stack (e.g. boxscore with player on top).
 * Closing the top modal pops the stack.
 */
export const AppModals = () => {
  const { stack, close } = useModalState()

  return (
    <>
      {stack.map((item, index) => {
        if (item.type === 'boxscore') {
          return <BoxscoreModal key={`boxscore-${item.data.pk}`} game={item.data} onClose={close} />
        }
        if (item.type === 'player') {
          return <PlayerModal key={`player-${item.data}`} personId={item.data} onClose={close} />
        }
        if (item.type === 'seasonWheelDemo') {
          return <SeasonWheelDemoModal key={`seasonWheelDemo-${index}`} onClose={close} />
        }
        return null
      })}
    </>
  )
}
