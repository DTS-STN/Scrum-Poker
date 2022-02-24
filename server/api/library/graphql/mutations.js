import {
  addLibrary,
  updateLibrary,
  deleteLibrary,
} from '../../../datasets/libraries.js'

export default {
  addLibrary: async (_, { id, name, books }) => {
    if (addLibrary(id, name, books)) {
      return { success: true, message: 'Library added' }
    } else {
      return { success: false, message: 'Failed to add library' }
    }
  },
  updateLibrary: async (_, { id, name, books }) => {
    if (updateLibrary(id, name, books)) {
      return { success: true, message: 'Library updated' }
    } else {
      return { success: false, message: 'Failed to update library' }
    }
  },
  deleteLibrary: async (_, { id }) => {
    if (deleteLibrary(id)) {
      return { success: true, message: 'Library deleted' }
    } else {
      return { success: false, message: 'Failed to delete library' }
    }
  },
}
