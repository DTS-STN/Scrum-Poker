import { getBooks, getBookByID } from '../../../datasets/books.js'

export default {
  books: (_, { id }) => {
    return id ? [getBookByID(id)] : getBooks()
  },
}
