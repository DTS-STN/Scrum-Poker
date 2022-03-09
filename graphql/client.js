import fetch from 'cross-fetch'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_CONTENT_GRAPHQL,
    fetch,
  }),
  cache: new InMemoryCache(),
})

export default client
