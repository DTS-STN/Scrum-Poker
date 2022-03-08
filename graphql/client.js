import fetch from 'cross-fetch'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://scrum-poker-server-main.bdm-dev.dts-stn.com/graphql',
    fetch,
  }),
  cache: new InMemoryCache(),
})

export default client
