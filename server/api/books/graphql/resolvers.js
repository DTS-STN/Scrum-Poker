import { getAuthorByID } from '../../../datasets/authors.js'
import { getLibraryByID } from '../../../datasets/libraries.js'

export default {
  Book: {
    author: (book) => {
      return getAuthorByID(book.author)
    },
    library: (book) => {
      return book.library.map((x) => getLibraryByID(x))
    },
  },
}
