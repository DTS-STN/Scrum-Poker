import PropTypes from 'prop-types'
import Player from './Player'

/**
 * List of players component
 */
export default function UserList(props) {
  const hiddenCard = {
    id: 'card-hidden',
    src: '/Card_Back.svg',
    value: 'hidden',
  }
  const displayPlayers = props.userList.map((player) => (
    <li className="w-full" key={player.id}>
      {props.currPlayer.id === player.id ? (
        // Current player.
        <Player
          playerName={player.name}
          selectedCard={props.isHidden ? hiddenCard : props.selectedCard}
          imgAlt="selectedCard"
          data-testid="current-player"
        />
      ) : (
        // Other players.
        // We need to set the cards of others with subscriptions.
        <Player
          playerName={player.name}
          imgAlt="blankCard"
          data-testid="other-players"
        />
      )}
    </li>
  ))
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
  isHidden: PropTypes.bool,
}
