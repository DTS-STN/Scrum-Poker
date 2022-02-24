import { getAuthors, getAuthorByID } from '../../../datasets/authors.js'

export default {
  authors: (_, { id }) => {
    return id ? [getAuthorByID(id)] : getAuthors()
  },
}
