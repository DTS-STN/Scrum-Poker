import { getBookByID } from '../../../datasets/books.js'

export default {
  Author: {
    books: (author) => {
      return author.books.map((x) => getBookByID(x))
    },
  },
}
