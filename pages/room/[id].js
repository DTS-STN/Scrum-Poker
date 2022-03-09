import PropTypes from 'prop-types'
import { useState } from 'react'
import Card from '../../components/Card'
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
  const [selectedCard, setSelectedCard] = useState(null)
  return (
    <div
      id="roomContent"
      className="container mx-auto px-6 mt-5 rounded-lg bg-slate-300 p-8"
    >
      <h1>Room {props.roomId}</h1>
      {!selectedCard ? (
        <h2>Select a card...</h2>
      ) : (
        <h2>
          Value selected:{' '}
          <span className="font-bold">{selectedCard.value}</span>
        </h2>
      )}
      <div
        id="roomContent"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 gap-2"
      >
        {cards.map((card) => {
          return (
            <Card
              src={card.src}
              id={card.id}
              key={card.id}
              alt={card.alt}
              onClick={() => setSelectedCard(card)}
              selected={card.id === selectedCard?.id}
            />
          )
        })}
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