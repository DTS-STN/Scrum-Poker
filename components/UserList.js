import PropTypes from 'prop-types'
import Player from './Player'
import { cards } from '../pages/room/[id]'

import { useState, useEffect } from 'react'

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
    'bg-[#8DD5F3]',
    'bg-[#FFABAB]',
    'bg-[#A7F5A6]',
    'bg-[#FFC672]',
    'bg-[#D197FF]',
    'bg-[#D2FC00]',
  ]

  function randomColor() {
    const idx = Math.floor(Math.random() * colorArray.length)
    return colorArray[idx]
  }

  const initialState = []

  function setInitialState() {
    props.userList.map((player) => {
      if (props.currPlayer?.id !== player.id) {
        initialState.push({ id: player.id, color: randomColor() })
      }
    })
  }

  useEffect(() => {
    if (userColor == undefined) {
      setInitialState()
      setUserColor(initialState)
    } else {
      // new colors will be assigned as users join
      if (userColor.length + 1 !== props.userList.length) {
        setInitialState()
        setUserColor(initialState)
      }
    }
  }, [props.userList])

  const [userColor, setUserColor] = useState()

  // Returns true if user is in the array otherwise undefined
  function isUserInState(userId) {
    if (userColor == undefined) {
      return false
    }
    return userColor.includes(userId)
    // return userColor.includes(userId) ((user) => {
    //   return user.id ===
    // })
  }

  // returns user color or a randomColor is the user isn't on the state
  function getUserColorById(userId) {
    if (isUserInState(userId)) {
      return userColor.find((user) => {
        return user.id == userId
      }).color
    } else {
      console.log(
        'userId was not found assigning a random color, this should not happen'
      )
      return randomColor()
    }
  }

  const getSelectedCard = (value) => cards.find((card) => card.value === value)

  const displayPlayers = props.userList.map((player) => {
    return (
      <li className="w-full" key={player.id}>
        <Player
          playerName={player.name}
          bgColor={
            props.currPlayer?.id === player.id
              ? 'bg-pink-500'
              : getUserColorById(player.id)
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
}
