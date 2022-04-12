import fetch from 'cross-fetch'
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

//Checks if the code is being executed by the client or the server
//The server can't handle subscriptions nor should it
let isClient = typeof window !== 'undefined'

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
  },
  query: {
    fetchPolicy: 'no-cache',
  },
}

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP,
  fetch,
})

const link = isClient
  ? (() => {
      //return split ws and http link
      const wsClient = createClient({
        url: process.env.NEXT_PUBLIC_GRAPHQL_WS,
      })

      const wsLink = new GraphQLWsLink(wsClient)

      const splitLink = split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },
        wsLink,
        httpLink
      )
      return splitLink
    })()
  : (() => {
      //return only http link
      return httpLink
    })()

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: defaultOptions,
})

export default client
