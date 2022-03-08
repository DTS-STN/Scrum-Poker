import PropTypes from 'prop-types'
import Player from './Player'

/**
 * Simple HomeCardContainer component
 */
export default function UserList(props) {
  const displayPlayers = props.userList.map((player) => (
    <li className="w-full" key={player.key}>
      <Player playerName={player.playerName} playerCard={player.playerCard} />
    </li>
  ))
  return (
    <div className="rounded border p-2 flex flex-col bg-white">
      <div className="flex justify-between border-b-2 border-slate-300 p-2">
        <p className="px-2">User</p>
        <p className="px-2">Card</p>
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
       * Title for the card
       */
      playerName: PropTypes.string,

      /**
       * Text for the card
       */
      playerCard: PropTypes.string,
    })
  ),
}
