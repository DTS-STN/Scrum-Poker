let authors = [
  {
    id: 1,
    name: 'Kate Chopin',
    books: [1, 2],
  },
  {
    id: 2,
    name: 'Paul Auster',
    books: [3],
  },
  {
    id: 3,
    name: 'Tom Clancy',
    books: [4, 5, 6],
  },
]

function getAuthors() {
  return authors
}

function getAuthorByID(id) {
  return authors.find((author) => author.id == id)
}

function addAuthor(id, name, books) {
  if (getAuthorByID(id) != undefined) {
    //Author with given ID Exists
    return false
  }
  const author = {
    id: Number(id),
    name: name,
    books: books.map(Number),
  }
  authors.push(author)
  return true
}

function updateAuthor(id, name, books) {
  let author = getAuthorByID(id)
  if (getAuthorByID(id) == undefined) {
    return false
  }
  author.name = name
  author.books = books
  return true
}

function deleteAuthor(id) {
  if (getAuthorByID(id) == undefined) {
    //Author with given ID Does Not Exist
    return false
  }

  const index = authors.findIndex((a) => a.id == id)
  authors.splice(index, 1)
  return true
}

export { getAuthors, getAuthorByID, addAuthor, updateAuthor, deleteAuthor }
