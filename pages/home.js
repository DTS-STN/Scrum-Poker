import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'
import HomeCardContainer from '../components/HomeCardContainer'
import TextInput from '../components/TextInput'

import { fetchContent } from '../lib/cms'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    console.log(e.target.owner.value)

    //TODO: Make call to back end to get random room id.
    //TODO: Redirect user to that room id.
    //  router.push({
    //    pathname: "/room/1",
    //    query: {q: "test"},
    //  })
  }

  const handleJoinSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div
      data-testid="homeContent"
      id="homeContent"
      className="container grid grid-cols-1 gap-y-5 mx-auto sm:flex sm:justify-around"
    >
      <HomeCardContainer title={t.createRoomTitle} desc={t.createRoomDesc}>
        <form
          onSubmit={handleCreateSubmit}
          className="flex flex-col justify-between h-full"
        >
          <TextInput
            id="owner"
            label={t.createRoomLabel}
            placeholder={t.createRoomPlaceholder}
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded max-h-10 mt-12 focus:drop-shadow focus:ring-2 focus:ring-gray-600"
          >
            {t.createRoomButton}
          </button>
        </form>
      </HomeCardContainer>
      <HomeCardContainer title={t.joinRoomTitle} desc={t.joinRoomDesc}>
        <form
          onSubmit={handleJoinSubmit}
          className="flex flex-col justify-between h-full"
        >
          <TextInput
            id="roomCode"
            label={t.joinRoomNumberLabel}
            placeholder={t.joinRoomNumberPlaceholder}
          />
          <TextInput
            id="newRoomName"
            label={t.joinRoomNameLabel}
            placeholder={t.joinRoomNamePlaceholder}
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded max-h-10 mt-12 focus:drop-shadow focus:ring-2 focus:ring-gray-600"
          >
            {t.joinRoomButton}
          </button>
        </form>
      </HomeCardContainer>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  const content = await fetchContent()

  /* istanbul ignore next */
  const langToggleLink = locale === 'en' ? '/fr/home' : '/home'

  /* Place-holder Meta Data Props */
  const meta = {
    data_en: {
      title: 'Next Template - Home',
      desc: 'English',
      author: 'Service Canada',
      keywords: '',
    },
    data_fr: {
      title: 'Next Template - Accueil',
      desc: 'Français',
      author: 'Service Canada',
      keywords: '',
    },
  }

  return {
    props: { locale, langToggleLink, content, meta },
  }
}

Home.propTypes = {
  /**
   * current locale in the address
   */
  locale: PropTypes.string,

  /*
   * Meta Tags
   */
  meta: PropTypes.object,
}
