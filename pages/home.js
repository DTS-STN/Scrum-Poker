import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'

import { fetchContent } from '../lib/cms'

import { gql, useQuery } from '@apollo/client'
import GET_BOOKS_QUERY from '../graphql/queries/example.graphql'
import client from '../graphql/client'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr

  //Load GraphQL Data
  const { data, error, loading } = useQuery(GET_BOOKS_QUERY)

  if (loading) return <p>loading....</p>
  if (error) return <p>{error.message}</p>

  return (
    <div
      id="homeContent"
      className="container mx-auto px-6 mt-5 bg-slate-300 p-8"
    >
      <h1>{props.content.header}</h1>
      <p>{props.content.paragraph}</p>
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
