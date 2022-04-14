import PropTypes from 'prop-types'
import Player from './Player'
import { cards } from '../utils/cards'

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

  console.log('userList list of users ', props.userList)

  const displayPlayers = props.userList.map((player) => {
    return (
      <li className="w-full" key={player.id}>
        {console.log(
          props.currPlayer?.id === player.id ? 'bg-pink-500' : player.color
        )}
        <Player
          playerId={player.id}
          playerName={player.name}
          bgColor={
            props.currPlayer?.id === player.id ? 'bg-pink-500' : player.color
          }
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
          isHost={player.id === props.host}
          showBoot={
            props.currPlayer?.id === props.host &&
            props.currPlayer?.id !== player.id
          }
          t={props.t}
          onBootClick={props.onBootClick}
        />
      </li>
    )
  })
  return (
    <div className=" py-2 px-4 flex flex-col mt-2">
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

  /**
   * onBootClick function
   */
  onBootClick: PropTypes.func,
}
