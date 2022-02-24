let books = [
  {
    id: 1,
    title: 'The Awakening',
    author: 1,
    library: [1, 2],
  },
  {
    id: 2,
    title: 'The Story of an Hour',
    author: 1,
    library: [1],
  },
  {
    id: 3,
    title: 'City of Glass',
    author: 2,
    library: [2],
  },
  {
    id: 4,
    title: 'Rainbow Six',
    author: 3,
    library: [1],
  },
  {
    id: 5,
    title: 'Hunt for Red October',
    author: 3,
    library: [2],
  },
  {
    id: 6,
    title: 'The Sum of All Fears',
    author: 3,
    library: [],
  },
]

function getBooks() {
  return books
}

function getBookByID(id) {
  return books.find((book) => book.id == id)
}

function addBook(id, title, author, library) {
  if (getBookByID(id) != undefined) {
    //Book with given ID Exists
    return false
  }
  const book = {
    id: id,
    title: title,
    author: author,
    library: library,
  }
  books.push(book)
  return true
}

function updateBook(id, title, author, library) {
  let book = getBookByID(id)
  if (getBookByID(id) == undefined) {
    return false
  }
  book.title = title
  book.author = author
  book.library = library
  return true
}

function deleteBook(id) {
  if (getBookByID(id) == undefined) {
    //Book with given ID Does Not Exist
    return false
  }

  const index = books.findIndex((b) => b.id == id)
  books.splice(index, 1)
  return true
}

export { getBooks, getBookByID, addBook, updateBook, deleteBook }
