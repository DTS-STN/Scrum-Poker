import PropTypes from 'prop-types'
import Player from './Player'
import { cards } from '../pages/room/[id]'

import { useState } from 'react'

/**
 * List of players component
 */
export default function UserList(props) {
  const hiddenCard = {
    id: 'card-hidden',
    src: '/Card_Back.svg',
    value: 'hidden',
  }

  const colorArray = [
    'bg-[#7ea9e1]',
    'bg-[#ed004f]',
    'bg-[#00fcf0]',
    'bg-[#d2fc00]',
    'bg-[#7bff00]',
    'bg-[#fa6900]',
  ]

  const randomColor = colorArray[Math.floor(Math.random() * colorArray.length)]
  const [userColor, setUserColor] = useState([
    { id: 95296, color: 'bg-[#d2fc00]' },
    { id: 29477, color: 'bg-yellow-500' },
  ])

  const getUserColorById = (userId) => {
    return userColor.find((user) => {
      return user.id == userId
    })
  }

  props.userList.map((player) => {
    const color = getUserColorById(player.id)
    if (!color) {
      setUserColor(...userColor, { id: player.id, color: 'bg-[#7bff00]' })
    }
  })
  const getSelectedCard = (value) => cards.find((card) => card.value === value)

  const displayPlayers = props.userList.map((player) => (
    <li className="w-full" key={player.id}>
      {console.log(userColor)}
      {console.log(player.id)}

      {props.currPlayer?.id === player.id ? (
        // Current player.
        <Player
          playerName={player.name}
          selectedCard={getSelectedCard(player.card)}
          imgAlt="selectedCard"
          data-testid="current-player"
          bgColor={getUserColorById(player.id).color}
        />
      ) : (
        // Other players.
        // We need to set the cards of others with subscriptions.
        <Player
          playerName={player.name}
          bgColor={getUserColorById(player.id).color}
          selectedCard={
            player.card
              ? props.isShown
                ? getSelectedCard(player.card)
                : hiddenCard
              : null
          }
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
  isShown: PropTypes.bool,
}
