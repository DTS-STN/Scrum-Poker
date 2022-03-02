import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'
import HomeCardContainer from '../components/HomeCardContainer'
import TextInput from '../components/TextInput'
import { useRouter } from 'next/router'

import { fetchContent } from '../lib/cms'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr

  const router = useRouter()

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
      id="homeContent"
      className="container grid grid-cols-1 gap-y-5 sm:flex sm:justify-around "
    >
      <HomeCardContainer>
        <form onSubmit={handleCreateSubmit} className="form-horizontal">
          <TextInput
            id="owner"
            label="Enter Your Name"
            placeholder="Your Name"
          />
          <button
            type="submit"
            className="mt-16 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Room
          </button>
        </form>
      </HomeCardContainer>
      <HomeCardContainer>
        <form onSubmit={handleJoinSubmit} className="form-horizontal">
          <TextInput
            id="roomCode"
            label="Enter Room Code"
            placeholder="Room Code"
          />
          <TextInput
            id="newName"
            label="Enter Your Name"
            placeholder="Your Name"
          />
          <button
            type="submit"
            className="mt-16 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Join Room
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
