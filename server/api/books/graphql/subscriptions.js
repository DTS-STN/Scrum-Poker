import { pubsub } from '../../graphql/pubsub.js'

export default {
  bookAdded: {
    subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
  },
}
