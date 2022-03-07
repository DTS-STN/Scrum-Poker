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
      className="container grid grid-cols-1 gap-y-5 mx-auto sm:flex sm:justify-center sm:gap-x-5"
    >
      <HomeCardContainer>
        <h1 className="text-opacity-75 text-black font-bold text-2xl">
          {t.createRoomTitle}
        </h1>
        <h2 className="text-opacity-75 text-black text-xl">
          {t.createRoomDesc}
        </h2>

        <form
          onSubmit={handleCreateSubmit}
          className="flex flex-col justify-between h-full items-center"
        >
          <TextInput
            id="owner"
            label={t.createRoomLabel}
            placeholder={t.createRoomPlaceholder}
          />
          <button
            type="submit"
            className="w-max font-display text-white bg-[#318000] hover:bg-[#1D4D00] active:bg-[#102900] py-3 px-5 rounded mt-12 focus:drop-shadow focus:ring-2 focus:ring-gray-600 border border-[#458259] text-[22px] leading-8 [text-shadow:1px_2px_0px_#333]"
          >
            {t.createRoomButton}
          </button>
        </form>
      </HomeCardContainer>
      <HomeCardContainer title={t.joinRoomTitle} desc={t.joinRoomDesc}>
        <h1 className="text-opacity-75 text-black font-bold text-2xl">
          {t.joinRoomTitle}
        </h1>
        <h2 className="text-opacity-75 text-black text-xl">{t.joinRoomDesc}</h2>
        <form
          onSubmit={handleJoinSubmit}
          className="flex flex-col justify-between h-full items-center"
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
            className="w-max font-display text-white bg-[#318000] hover:bg-[#1D4D00] active:bg-[#102900] py-3 px-5 rounded mt-12 focus:drop-shadow focus:ring-2 focus:ring-gray-600 border border-[#458259] text-[22px] leading-8 [text-shadow:1px_2px_0px_#333]"
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
