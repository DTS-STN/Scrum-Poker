import '../styles/globals.css'

import { ApolloProvider } from '@apollo/client'
import client from '../graphql/client'
import Layout from '../components/Layout'

import UserIdProvider from '../context/userIdContext'

function MyApp({ Component, pageProps }) {
  /* istanbul ignore next */
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />)
  }

  /* istanbul ignore next */
  return (
    <ApolloProvider client={client}>
      <UserIdProvider>
        <Layout
          locale={pageProps.locale}
          meta={pageProps.meta}
          langToggleLink={pageProps.langToggleLink}
        >
          <Component {...pageProps} />
        </Layout>
      </UserIdProvider>
    </ApolloProvider>
  )
}

export default MyApp
