import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Card from '../../components/Card'
import RoomInfo from '../../components/RoomInfo'
import ChatRoom from '../../components/ChatRoom'
import UserList from '../../components/UserList'
import { useSubscription, useMutation } from '@apollo/client'
import GET_ROOM from '../../graphql/queries/getRoom.graphql'
import USER_SUBSCRIPTION from '../../graphql/subscriptions/user.graphql'
import ROOM_SUBSCRIPTION from '../../graphql/subscriptions/room.graphql'
import MESSAGE_SUBSCRIPTION from '../../graphql/subscriptions/message.graphql'
import UPDATE_USER from '../../graphql/mutations/updateUser.graphql'
import UPDATE_ROOM from '../../graphql/mutations/updateRoom.graphql'
import DELETE_USER from '../../graphql/mutations/deleteUser.graphql'
import { useRouter } from 'next/router'
import en from '../../locales/en'
import fr from '../../locales/fr'
import client from '../../graphql/client.js'
import Cookies from 'js-cookie'

import { cards, getCardByValue } from '../../utils/cards'

export default function Room(props) {
  const t = props.locale === 'en' ? en : fr
  const router = useRouter()
  const [updatedUser] = useMutation(UPDATE_USER)
  const [updateRoom] = useMutation(UPDATE_ROOM)
  const [deleteUser] = useMutation(DELETE_USER)
  const [room, setRoom] = useState(props.room)
  const [users, setUsers] = useState(props.users)
  const [messages, setMessages] = useState([])
  const [userId, setUserId] = useState(null)

  const getUserById = (userId) => {
    return users.find((user) => {
      return user.id === userId
    })
  }
  const removeUserById = (userId) => {
    const index = users.findIndex((user) => user.id === userId)
    if (index > -1) {
      let newUsersArray = [...users]
      newUsersArray.splice(index, 1)
      setUsers(newUsersArray)
    }
    return null
  }

  const filteredCards = cards.filter((card) =>
    props.room.cards.includes(card.value)
  )

  const handleClear = (e) => {
    e.preventDefault()

    //Loop through users in room and set their cards to null
    try {
      users.forEach((user) => {
        updatedUser({
          variables: {
            userInput: {
              id: user.id,
              name: user.name,
              card: null,
              room: user.room,
              color: user.color,
            },
          },
        })
      })

      //Update the room so isShown is false
      updateRoom({
        variables: {
          updateRoomId: room.id,
          updateRoomUsers: room.userIds,
          isShown: false,
          cards: room.cards,
          timer: {
            timestamp: null,
            duration: null,
          },
        },
      })
    } catch (e) {
      //Something went wrong
      console.log(e)
    }
  }

  useEffect(() => {
    const currCookie = Cookies.get('userid')
    // Check if browser has userid cookie.
    if (!currCookie) {
      router.push({
        pathname: `/home`,
        query: `errorcode=309`,
      })
    } else {
      // Check if userID cookie is in the room.
      const userIsInRoom = getUserById(currCookie)
      if (!userIsInRoom) {
        router.push({
          pathname: `/home`,
          query: `errorcode=310`,
        })
      }

      // User is in this room.
      setUserId(currCookie)
    }
  }, [])

  //User subscription and useEffect to update users
  const userSubscription = useSubscription(USER_SUBSCRIPTION, {
    variables: { room: props.roomId },
  })
  useEffect(() => {
    if (userSubscription.loading) {
      //Do nothing
    }
    if (userSubscription.error) {
      //TODO: Handle error
    }
    if (userSubscription.data) {
      let userFound = false
      let updatedUsers = users.map((user) => {
        if (user.id === userSubscription.data.userModified.id) {
          userFound = true
          return userSubscription.data.userModified
        }
        return user
      })
      if (!userFound) {
        updatedUsers = [...updatedUsers, userSubscription.data.userModified]
      }
      setUsers(updatedUsers)
    }
  }, [userSubscription])

  //Room subscription and useEffect to update room
  const roomSubscription = useSubscription(ROOM_SUBSCRIPTION, {
    variables: { room: props.roomId },
  })
  useEffect(() => {
    if (roomSubscription.data) {
      const { roomUpdated } = roomSubscription.data
      // check to see if a user was deleted
      users.forEach((oldUser) => {
        const foundUser = roomUpdated.users.findIndex(
          (newUser) => newUser.id === oldUser.id
        )
        if (foundUser === -1) {
          // a user was not found in the new list of users, delete the user from the UserList component.
          removeUserById(oldUser.id)

          // Check to see if the player that left is you.
          if (userId === oldUser.id) {
            // navigate user to home page
            router.push({
              pathname: `/home`,
              query: `errorcode=311`,
            })
          }
        }
      })
      const updatedRoomData = {
        id: roomUpdated.id,
        host: roomUpdated.host.id,
        userIds: roomUpdated.users.map((user) => {
          return user.id
        }),
        isShown: roomUpdated.isShown,
        timer: roomUpdated.timer,
        cards: roomUpdated.cards,
      }
      setRoom(updatedRoomData)
    }
  }, [roomSubscription])

  // Message subscription
  const messageSubscription = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { roomId: props.roomId },
  })

  // Updated messages
  useEffect(() => {
    if (messageSubscription.loading) {
      //Do nothing
    }
    if (messageSubscription.error) {
      //TODO: Handle error
    }
    if (messageSubscription.data) {
      setMessages(messageSubscription.data.roomMessages)
    }
  }, [messageSubscription])

  const onCardClickHandler = async (e, card) => {
    const updatedUserData = {
      id: Number(getUserById(userId).id),
      name: getUserById(userId)?.name,
      card: card.value,
      room: getUserById(userId)?.room,
    }
    try {
      const updateUserRes = await updatedUser({
        variables: {
          userInput: updatedUserData,
        },
      }).catch((e) => {
        throw e
      })
    } catch (e) {
      throw e
    }
  }

  const onBootClick = async (playerId) => {
    let playerIdToRemove = playerId || userId
    const index = room.userIds.indexOf(playerIdToRemove)

    // if (globalUserId === playerId) {
    //   router.push({
    //     pathname: `/home?errorcode=308`,
    //   })
    // }

    if (index > -1) {
      let copiedRoomUserIds = [...room.userIds]
      copiedRoomUserIds.splice(index, 1)
      try {
        // remove user from room
        await updateRoom({
          variables: {
            updateRoomId: room.id,
            updateRoomUsers: copiedRoomUserIds,
            isShown: room.isShown,
            timer: room.timer,
            cards: room.cards,
          },
        }).catch((e) => {
          throw e
        })
        // remove user from backend
        deleteUser({
          variables: {
            deleteUserId: playerIdToRemove,
          },
        }).catch((e) => {
          throw e
        })
      } catch (e) {
        throw e
      }
    }
  }

  const leaveRoomClick = async () => {
    if (userId === room.host) {
      console.log('Owner trying to leave room. To be implemented.')
    } else {
      onBootClick()
    }
  }
  return (
    <div id="homeContent" className="container mx-auto my-5 rounded-lg ">
      {/* Main 'row' */}
      <div className="flex w-full flex-col space-y-3 lg:space-y-0 lg:flex-row px-2">
        {/* Left Column */}
        <div className="w-full lg:w-4/5 lg:mr-2 border-2 rounded-md">
          {!getUserById(userId)?.card ? (
            <h2 className="border-b-2 p-2 bg-gray-200 mx-auto font-semibold font-body text-center text-lg text-slate-700">
              {t.welcome}
            </h2>
          ) : (
            <h2 className="flex justify-center border-b-2 p-2 bg-gray-200 mx-auto font-semibold font-body text-lg text-slate-700 ">
              Value selected:{' '}
              <span className="font-bold px-1">
                <span
                  className={getCardByValue(getUserById(userId)?.card).style}
                >
                  {getCardByValue(getUserById(userId)?.card).text}
                </span>
              </span>
            </h2>
          )}

          {/* Cards box */}
          <div>
            <div className="p-4 pb-1 flex mx-auto flex-row ">
              <ul
                id="cards"
                className="flex flex-wrap gap-2 mx-auto items-center justify-center "
              >
                {filteredCards.map((card) => {
                  return (
                    <li className="h-auto w-20" key={card.id}>
                      <Card
                        src={card.src}
                        id={card.id}
                        alt={card.alt}
                        onClick={(e) => onCardClickHandler(e, card)}
                        onKeyDown={(e) => {
                          if (e.keyCode === 32 || e.keyCode === 13) {
                            onCardClickHandler(e, card)
                          }
                        }}
                        selected={card.value === getUserById(userId)?.card}
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* end of cards */}
          {userId == room.host ? (
            <div className="flex justify-center p-1">
              {!room.isShown ? (
                <button
                  type="button"
                  className="w-1/6 m-2 font-display text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] p-2 rounded border border-[#091C2D] text-[16px]"
                  onClick={() =>
                    updateRoom({
                      variables: {
                        updateRoomId: room.id,
                        updateRoomUsers: room.userIds,
                        isShown: true,
                        timer: {
                          timestamp: room.timer.timestamp,
                          duration: room.timer.duration,
                        },
                        cards: room.cards,
                      },
                    })
                  }
                >
                  {t.showCards}
                </button>
              ) : (
                <button
                  type="button"
                  className="w-1/6 m-2 font-display text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] p-2 rounded border border-[#091C2D] text-[16px]"
                  onClick={() =>
                    updateRoom({
                      variables: {
                        updateRoomId: room.id,
                        updateRoomUsers: room.userIds,
                        isShown: false,
                        timer: {
                          timestamp: room.timer.timestamp,
                          duration: room.timer.duration,
                        },
                        cards: room.cards,
                      },
                    })
                  }
                >
                  {t.hideCards}
                </button>
              )}
              <button
                type="button"
                className="w-1/6 m-2 font-display text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] p-2 rounded border border-[#091C2D] text-[16px]"
                onClick={handleClear}
              >
                {t.clearCards}
              </button>
            </div>
          ) : null}
          {/* User list */}
          <UserList
            t={t}
            userList={users}
            isShown={room.isShown}
            currPlayer={getUserById(userId)}
            host={room.host}
            onBootClick={onBootClick}
          />
        </div>

        {/* Right Col */}
        <div className="w-full lg:pt-0 lg:w-1/5">
          <div>
            <RoomInfo
              id="roomid"
              t={t}
              roomId={props.roomId}
              playerName={getUserById(userId)?.name}
              playersOnline={users.length}
              roomData={room}
              updateRoom={updateRoom}
              isHost={userId == room.host}
              onClick={leaveRoomClick}
            />
          </div>

          {/* uncomment to show the chat room */}
          <div>
            <ChatRoom
              id="chat"
              roomId={props.roomId}
              name={getUserById(userId)?.name}
              messages={messages}
              t={t}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ params, locale }) {
  const roomId = params.id

  const langToggleLink =
    locale === 'en' ? '/fr/room/' + params.id : '/room/' + params.id

  /* Place-holder Meta Data Props */
  const meta = {
    data_en: {
      title: 'Room - Scrum Poker',
      desc: 'English',
      author: 'DTS',
      keywords: '',
    },
    data_fr: {
      title: 'Salle - Scrum Poker',
      desc: 'Français',
      author: 'DTS',
      keywords: '',
    },
  }

  //TODO: fetch room data from roomId
  const queryResponse = await client.query({
    query: GET_ROOM,
    variables: { roomsId: roomId },
  })
  const roomInfo = queryResponse.data?.rooms[0]
  // Check if room exists
  if (!roomInfo) {
    return {
      redirect: {
        permanent: false,
        destination: '/home?errorcode=308',
      },
    }
  }

  const room = {
    id: roomInfo.id,
    host: roomInfo.host.id,
    userIds: roomInfo.users.map((user) => {
      return user.id
    }),
    isShown: roomInfo.isShown,
    timer: roomInfo.timer,
    cards: roomInfo.cards,
  }

  const users = roomInfo.users

  return {
    props: { roomId, meta, locale, langToggleLink, room, users },
  }
}

Room.propTypes = {
  /**
   * current locale in the address
   */
  roomId: PropTypes.string,
}
