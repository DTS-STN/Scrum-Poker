import { getBookByID } from '../../../datasets/books.js'

export default {
  Library: {
    books: (library) => {
      return library.books.map((x) => getBookByID(x))
    },
  },
}
