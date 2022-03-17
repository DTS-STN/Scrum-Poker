import PropTypes from 'prop-types'
import { useState } from 'react'
import Card from '../../components/Card'
import RoomInfo from '../../components/RoomInfo'
import UserList from '../../components/UserList'
import en from '../../locales/en'
import fr from '../../locales/fr'

export default function Room(props) {
  const t = props.locale === 'en' ? en : fr
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
  const hiddenCard = {
    id: 'card-hidden',
    src: '/Card_Back.svg',
    value: 'hidden',
  }

  const [selectedCard, setSelectedCard] = useState(null)
  const [isHidden, setHidden] = useState(false)

  // Here we can call the back end on load to get the list of all users in the connected websocket.
  const [users, setUsers] = useState([
    {
      id: 'u1',
      playerName: 'Numpty Numpty',
      playerCard: '1',
    },
    {
      id: 'u2',
      playerName: 'Blether',
      playerCard: '2',
    },
  ])

  // Here we can call the back end on load to get the current session user id and setCurrPlayer.
  const [currPlayer, setCurrPlayer] = useState({
    id: 'u1',
    playerName: 'Numpty Numpty',
    playerCard: '1',
  })

  return (
    <div
      id="homeContent"
      className="container mx-auto px-6 mt-5 rounded-lg bg-slate-300 p-8"
    >
      <RoomInfo
        id="roomid"
        t={t}
        roomId={props.roomId}
        playerName={currPlayer.playerName}
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
      {/* User list */}
      <UserList
        t={t}
        userList={users}
        selectedCard={isHidden ? hiddenCard : selectedCard}
        currPlayer={currPlayer}
      ></UserList>
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
