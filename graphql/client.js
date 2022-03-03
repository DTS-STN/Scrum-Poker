import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://scrum-poker-server-main.bdm-dev.dts-stn.com/graphql',
  cache: new InMemoryCache(),
})

export default client
