import PropTypes from 'prop-types'
import Player from './Player'
import { cards } from '../pages/room/[id]'
/**
 * List of players component
 */
export default function UserList(props) {
  const hiddenCard = {
    id: 'card-hidden',
    src: '/Card_Back.svg',
    value: 'hidden',
  }

  const getSelectedCard = (value) => cards.find((card) => card.value === value)

  const displayPlayers = props.userList.map((player) => {
    return (
      <li className="w-full" key={player.id}>
        <Player
          playerName={player.name}
          selectedCard={
            props.currPlayer?.id === player.id
              ? getSelectedCard(player.card)
              : player.card
              ? props.isShown
                ? getSelectedCard(player.card)
                : hiddenCard
              : null
          }
          imgAlt="blankCard"
          data-testid="other-players"
          host={player.id === props.host}
          showBoot={
            props.currPlayer?.id === props.host &&
            props.currPlayer?.id !== player.id
          }
          t={props.t}
        />
      </li>
    )
  })
  return (
    <div className="rounded border p-2 flex flex-col bg-white mt-2">
      <div className="flex justify-between border-b-2 border-slate-300 p-2 text-lg font-display font-semibold text-slate-700 tracking-wide">
        <p className="px-2">{props.t.users}</p>
        <p className="px-2">{props.t.card}</p>
      </div>
      <ul className="flex flex-col " data-testid="cardList">
        {props.userList ? displayPlayers : ''}
      </ul>
      {props.children}
    </div>
  )
}

UserList.propTypes = {
  /**
   * The card page that the card will display
   */
  userList: PropTypes.arrayOf(
    PropTypes.shape({
      player: PropTypes.object,
    })
  ).isRequired,
  /**
   * current player
   */
  currPlayer: PropTypes.object,
  /**
   * selected card for the list
   */
  selectedCard: PropTypes.object,
  /**
   * Translated text
   */
  t: PropTypes.object,
  /**
   * If cards are hidden or not
   */
  isShown: PropTypes.bool,
  /**
   * Identifier for room host
   */
  host: PropTypes.string,
}
