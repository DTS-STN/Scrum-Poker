import {
  addAuthor,
  updateAuthor,
  deleteAuthor,
} from '../../../datasets/authors.js'

export default {
  addAuthor: async (_, { id, name, books }) => {
    if (addAuthor(id, name, books)) {
      return { success: true, message: 'Author added' }
    } else {
      updateAuthor(id, name, books)
      return { success: false, message: 'Failed to add author' }
    }
  },
  updateAuthor: async (_, { id, name, books }) => {
    if (updateAuthor(id, name, books)) {
      return { success: true, message: 'Author updated' }
    } else {
      return { success: false, message: 'Failed to update author' }
    }
  },
  deleteAuthor: async (_, { id }) => {
    if (deleteAuthor(id)) {
      return { success: true, message: 'Author deleted' }
    } else {
      return { success: false, message: 'Failed to delete author' }
    }
  },
}
