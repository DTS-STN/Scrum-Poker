import { getLibraries, getLibraryByID } from '../../../datasets/libraries.js'

export default {
  libraries: (_, { id }) => {
    return id ? [getLibraryByID(id)] : getLibraries()
  },
}
