import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Card from '../../components/Card'
import RoomInfo from '../../components/RoomInfo'
import UserList from '../../components/UserList'

import { useQuery, useSubscription } from '@apollo/client'
import GET_ROOM_INFO from '../../graphql/queries/getRoomByID.graphql'
import USER_SUBSCRIPTION from '../../graphql/subscriptions/user.graphql'
import en from '../../locales/en'
import fr from '../../locales/fr'

export default function Room(props) {
  const t = props.locale === 'en' ? en : fr
  const [pageState, setPageState] = useState(null)
  const cards = [
    { id: 'card-1', src: '/Card_1.svg', value: 1 },
    { id: 'card-2', src: '/Card_2.svg', alt: 'Card image', value: 2 },
    { id: 'card-3', src: '/Card_3.svg', alt: 'Card image', value: 3 },
    { id: 'card-4', src: '/Card_5.svg', alt: 'Card image', value: 5 },
    { id: 'card-5', src: '/Card_8.svg', alt: 'Card image', value: 8 },
    { id: 'card-6', src: '/Card_13.svg', alt: 'Card image', value: 13 },
    { id: 'card-7', src: '/Card_20.svg', alt: 'Card image', value: 20 },
    { id: 'card-8', src: '/Card_infinity.svg', alt: 'Card image', value: '∞' },
  ]

  const [selectedCard, setSelectedCard] = useState(null)
  const [isHidden, setHidden] = useState(false)

  const [users, setUsers] = useState(null)

  const [currPlayer, setCurrPlayer] = useState({
    id: null,
    name: null,
    card: selectedCard,
  })

  const [isOwner, setIsOwner] = useState(false)

  const roomQuery = useQuery(GET_ROOM_INFO, {
    variables: { roomsId: props.roomId },
  })
  useEffect(() => {
    if (roomQuery.loading) setPageState('Loading...')
    if (roomQuery.error) setPageState('roomQuerry error')
    if (roomQuery.data) {
      // Get room info
      const roomInfo = roomQuery.data?.rooms[0]
      const userId =
        document.cookie.split('userid=')[1]?.substring(0, 5) || null

      if (roomInfo && userId) {
        //setUsers of the room
        setUsers(roomInfo.users)

        // Check if session has owner cookie
        const ownerId = document.cookie.indexOf('ownerid=')
        if (ownerId !== -1) setIsOwner(true)
        else setIsOwner(false)

        // Find current player and setCurrPlayer

        roomInfo.users.forEach((user) => {
          if (user.id === userId) {
            setCurrPlayer(user)
          }
        })
        setPageState(null)
      } else {
        if (!userId)
          setPageState('No user was defined before joining the room.')
        if (!roomInfo) setPageState('No room exists with this id.')
      }
    }
  }, [roomQuery])

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

  if (!pageState && users) {
    return (
      <div
        id="homeContent"
        className="container mx-auto px-6 mt-5 rounded-lg bg-slate-300 p-8"
      >
        <RoomInfo
          id="roomid"
          t={t}
          roomId={props.roomId}
          playerName={currPlayer.name}
          playersOnline={users.length}
        />

        {!selectedCard ? (
          <h2>Select a card...</h2>
        ) : (
          <h2>
            Value selected:{' '}
            <span className="font-bold">{selectedCard.value}</span>
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
                  onClick={() => setSelectedCard(card)}
                  onKeyDown={(e) => {
                    if (e.keyCode === 32 || e.keyCode === 13) {
                      setSelectedCard(card)
                    }
                  }}
                  selected={card.id === selectedCard?.id}
                />
              </li>
            )
          })}
        </ul>
        {isOwner ? (
          <div className="flex justify-center">
            <button
              type="button"
              className="w-1/5 m-5 font-display text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] py-2 px-2 rounded border border-[#091C2D] text-[16px] leading-8"
              onClick={() => setHidden(false)}
            >
              {t.showCards}
            </button>
            <button
              type="button"
              className="w-1/5 m-5 font-display text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] py-2 px-2 rounded border border-[#091C2D] text-[16px] leading-8"
              onClick={() => (selectedCard ? setHidden(true) : null)}
            >
              {t.hideCards}
            </button>
            <button
              type="button"
              className="w-1/5 m-5 font-display text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] py-2 px-2 rounded border border-[#091C2D] text-[16px] leading-8"
              onClick={() => {
                setSelectedCard(null)
                setHidden(false)
              }}
            >
              {t.clearCards}
            </button>
          </div>
        ) : null}
        {/* User list */}
        <UserList
          t={t}
          userList={users}
          selectedCard={selectedCard}
          isHidden={isHidden}
          currPlayer={currPlayer}
        ></UserList>
      </div>
    )
  }
  // pageState is not null, meaning its either loading, invalid roomid, no user cookie or theres an error with the request.
  return <p>{pageState}</p>
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

  return {
    props: { roomId, meta, locale, langToggleLink },
  }
}

Room.propTypes = {
  /**
   * current locale in the address
   */
  roomId: PropTypes.string,
}
