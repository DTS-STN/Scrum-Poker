import fetch from 'cross-fetch'
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

//Checks if the code is being executed by the client or the server
//The server can't handle subscriptions nor should it
let isClient = typeof window !== 'undefined'

const httpLink = new HttpLink({
  uri: process.env.NEXT_CONTENT_GRAPHQL,
  fetch,
})

let link = isClient
  ? (() => {
      const wsClient = createClient({
        url: 'ws://localhost:4000/graphql',
      })

      const wsLink = new GraphQLWsLink(wsClient)

      return split(
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
    })()
  : () => {
      return httpLink
    }

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
})

export default client
