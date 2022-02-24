let libraries = [
  {
    id: 1,
    name: 'Ottawa Public Library',
    books: [1, 2],
  },
  {
    id: 2,
    name: 'Morisset Library',
    books: [3, 1, 5],
  },
]

function getLibraries() {
  return libraries
}

function getLibraryByID(id) {
  return libraries.find((library) => library.id == id)
}

function addLibrary(id, name, books) {
  if (getLibraryByID(id) != undefined) {
    //Author with given ID Exists
    return false
  }
  const library = {
    id: id,
    name: name,
    books: books,
  }
  libraries.push(library)
  return true
}

function updateLibrary(id, name, books) {
  let library = getLibraryByID(id)
  if (getLibraryByID(id) == undefined) {
    return false
  }
  library.name = name
  library.books = books
  return true
}

function deleteLibrary(id) {
  if (getLibraryByID(id) == undefined) {
    //Author with given ID Does Not Exist
    return false
  }

  const index = libraries.findIndex((library) => library.id == id)
  libraries.splice(index, 1)
  return true
}

export {
  getLibraries,
  getLibraryByID,
  addLibrary,
  updateLibrary,
  deleteLibrary,
}
