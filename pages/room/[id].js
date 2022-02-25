import PropTypes from 'prop-types'

export default function Room(props) {
  return (
    <div id="roomContent" className="container mx-auto px-6 mt-5 bg-slate-300 p-8">
      <h1>Room {props.roomId}</h1>
    </div>
  )
}

export async function getServerSideProps({params}) {

  /* Place-holder Meta Data Props */
  const meta = {
    data_en: {
      title: 'Room - Scrum Poker',
      desc: 'English',
      author: 'DTS',
      keywords: '',
    },
    data_fr: {
      title: 'Accueil - Scrum Poker',
      desc: 'Français',
      author: 'DTS',
      keywords: '',
    },
  }

  const roomId = params.id;
  //TODO: fetch room data from roomId

  return {
    props: { roomId, meta },
  }
}

Room.propTypes = {
  /**
   * current locale in the address
   */
   roomId: PropTypes.number,
}
