const BookFields = `
  id: ID!
  title: String
  author: Author
  library: [Library]
`

const BookQueries = `
  books(id: ID): [Book]
`

const BookMutations = `
  addBook(id: ID!, title: String, author: ID, library: [ID]): Response
  updateBook(id: ID!, title: String, author: ID, library: [ID]): Response
  deleteBook(id: ID!): Response 
`

export default `
  type Book {
    ${BookFields}
  }
  type Query{
    ${BookQueries}
  }
  type Mutation{
    ${BookMutations}
  }
  type Subscription{
    bookAdded: Book
  }`
