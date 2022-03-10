import PropTypes from 'prop-types'
import Player from './Player'

/**
 * List of players component
 */
export default function UserList(props) {
  const displayPlayers = props.userList.map((player) => (
    <li className="w-full" key={player.id}>
      {props.currPlayer.id === player.id ? (
        // Current player.
        <Player
          playerName={player.playerName}
          playerCard={player.playerCard}
          selectedCard={props.selectedCard}
          imgAlt="selectedCard"
        />
      ) : (
        // Other players.
        <Player
          playerName={player.playerName}
          playerCard={player.playerCard}
          imgAlt="blankCard"
        />
      )}
    </li>
  ))
  return (
    <div className="rounded border p-2 flex flex-col bg-white">
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
      /**
       * name for the list
       */
      playerName: PropTypes.string,

      /**
       * Text for the list
       */
      playerCard: PropTypes.string,
      /**
       * user text for the list
       */
      users: PropTypes.string,
      /**
       * card ext for the list
       */
      card: PropTypes.string,
    })
  ),
}
