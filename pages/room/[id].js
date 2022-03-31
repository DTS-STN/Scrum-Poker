import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Card from '../../components/Card'
import RoomInfo from '../../components/RoomInfo'
import UserList from '../../components/UserList'
import { useSubscription, useMutation } from '@apollo/client'
import GET_ROOM from '../../graphql/queries/getRoom.graphql'
import USER_SUBSCRIPTION from '../../graphql/subscriptions/user.graphql'
import ROOM_SUBSCRIPTION from '../../graphql/subscriptions/room.graphql'
import UPDATE_USER from '../../graphql/mutations/updateUser.graphql'
import UPDATE_ROOM from '../../graphql/mutations/updateRoom.graphql'
import { useRouter } from 'next/router'
import en from '../../locales/en'
import fr from '../../locales/fr'
import client from '../../graphql/client.js'
import Cookies from 'js-cookie'

export const cards = [
  { id: 'card-1', src: '/Card_1.svg', value: 1 },
  { id: 'card-2', src: '/Card_2.svg', alt: 'Card image', value: 2 },
  { id: 'card-3', src: '/Card_3.svg', alt: 'Card image', value: 3 },
  { id: 'card-4', src: '/Card_5.svg', alt: 'Card image', value: 5 },
  { id: 'card-5', src: '/Card_8.svg', alt: 'Card image', value: 8 },
  { id: 'card-6', src: '/Card_13.svg', alt: 'Card image', value: 13 },
  { id: 'card-7', src: '/Card_20.svg', alt: 'Card image', value: 20 },
  { id: 'card-8', src: '/Card_infinity.svg', alt: 'Card image', value: 100 },
]

export default function Room(props) {
  const t = props.locale === 'en' ? en : fr
  const router = useRouter()
  const [updatedUser] = useMutation(UPDATE_USER)
  const [updateRoom] = useMutation(UPDATE_ROOM)
  const [room, setRoom] = useState(props.room)
  const [users, setUsers] = useState(props.users)
  const [userId, setUserId] = useState(null)
  const getUserById = (userId) => {
    return users.find((user) => {
      return user.id === userId
    })
  }

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
            },
          },
        })
      })

      //Update the room so isShown is false
      updateRoom({
        variables: {
          updateRoomId: room.id,
          users: room.userIds,
          isShown: false,
        },
      })
    } catch (e) {
      //Something went wrong
      console.log(e)
    }
  }

  useEffect(() => {
    let currCookie = Cookies.get('userid')
    // Check if browser has userid cookie.
    if (!currCookie) {
      router.push({
        pathname: `/home`,
        query: `error=Create user before joining a room`,
      })
    } else {
      // Check if userID cookie is in the room.
      const userIsInRoom = getUserById(currCookie)
      if (!userIsInRoom) {
        router.push({
          pathname: `/home`,
          query: `error=You are not member of this room.`,
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
      const updatedRoomData = {
        id: roomUpdated.id,
        host: roomUpdated.host.id,
        userIds: roomUpdated.users.map((user) => {
          return user.id
        }),
        isShown: roomUpdated.isShown,
      }
      setRoom(updatedRoomData)
    }
  }, [roomSubscription])

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
      console.log(e)
    }
  }
  return (
    <div
      id="homeContent"
      className="container mx-auto px-6 mt-5 rounded-lg bg-slate-300 p-8"
    >
      <RoomInfo
        id="roomid"
        t={t}
        roomId={props.roomId}
        playerName={getUserById(userId)?.name}
        playersOnline={users.length}
      />

      {!getUserById(userId)?.card ? (
        <h2>Select a card...</h2>
      ) : (
        <h2>
          Value selected:{' '}
          <span className="font-bold">{getUserById(userId)?.card}</span>
        </h2>
      )}
      <ul
        id="cards"
        className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 gap-2"
      >
        {cards.map((card) => {
          return (
            <li key={card.id}>
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
      {userId == room.host ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="w-1/5 m-5 font-display text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] py-2 px-2 rounded border border-[#091C2D] text-[16px] leading-8"
            onClick={() =>
              updateRoom({
                variables: {
                  updateRoomId: room.id,
                  updateRoomUsers: room.userIds,
                  isShown: true,
                },
              })
            }
          >
            {t.showCards}
          </button>
          <button
            type="button"
            className="w-1/5 m-5 font-display text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] py-2 px-2 rounded border border-[#091C2D] text-[16px] leading-8"
            onClick={() =>
              updateRoom({
                variables: {
                  updateRoomId: room.id,
                  updateRoomUsers: room.userIds,
                  isShown: false,
                },
              })
            }
          >
            {t.hideCards}
          </button>
          <button
            type="button"
            className="w-1/5 m-5 font-display text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] py-2 px-2 rounded border border-[#091C2D] text-[16px] leading-8"
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
      />
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
  if (!roomInfo) {
    return {
      redirect: {
        permanent: false,
        destination: '/home?error=No Room exists with this id.',
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
