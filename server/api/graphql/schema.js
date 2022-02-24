import gql from 'graphql-tag'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { subscriptions } from './pubsub.js'

//Object Schema Imports
import BookTypes from '../books/graphql/types.js'
import BookQueries from '../books/graphql/queries.js'
import BookMutations from '../books/graphql/mutations.js'
import BookResolvers from '../books/graphql/resolvers.js'
import BookSubscriptions from '../books/graphql/subscriptions.js'

import AuthorTypes from '../author/graphql/types.js'
import AuthorQueries from '../author/graphql/queries.js'
import AuthorMutations from '../author/graphql/mutations.js'
import AuthorResolvers from '../author/graphql/resolvers.js'

import LibraryTypes from '../library/graphql/types.js'
import LibraryQueries from '../library/graphql/queries.js'
import LibraryMutations from '../library/graphql/mutations.js'
import LibraryResolvers from '../library/graphql/resolvers.js'

const schema = {
  typeDefs: gql`
    ${BookTypes}
    ${AuthorTypes}
    ${LibraryTypes}

    type Response {
      success: Boolean
      message: String
    }
  `,

  resolvers: {
    Query: {
      ...BookQueries,
      ...AuthorQueries,
      ...LibraryQueries,
    },
    Mutation: {
      ...BookMutations,
      ...AuthorMutations,
      ...LibraryMutations,
    },
    ...BookResolvers,
    ...AuthorResolvers,
    ...LibraryResolvers,
    Subscription: {
      ...BookSubscriptions,
    },
  },

  subscriptions: subscriptions,
}

export default makeExecutableSchema(schema)
