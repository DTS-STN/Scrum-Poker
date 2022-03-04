import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'
import HomeCardContainer from '../components/HomeCardContainer'
import TextInput from '../components/TextInput'

import { fetchContent } from '../lib/cms'

import { gql, useQuery } from '@apollo/client'
import GET_BOOKS_QUERY from '../graphql/queries/example.graphql'
import client from '../graphql/client'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr

  //Load GraphQL Data
  const { data, error, loading } = useQuery(GET_BOOKS_QUERY)

  if (loading) return <p data-testid="loadingState">loading....</p>
  if (error) return <p data-testid="errorState">{error.message}</p>

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
      <HomeCardContainer title={t.createRoomTitle} desc={t.createRoomDesc}>
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
      {data?.books.map((book) => (
        <div key={book.id}>
          <p>
            {book.id} - {book.title}
          </p>
        </div>
      ))}
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
