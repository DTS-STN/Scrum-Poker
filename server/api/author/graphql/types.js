const AuthorFields = `
  id: ID!
  name: String
  books: [Book]
`

const AuthorQueries = `
  authors(id: ID): [Author]
`

const AuthorMutations = `
  addAuthor(id: ID!, name: String, books: [ID]): Response
  updateAuthor(id: ID!, name: String, books: [ID]): Response
  deleteAuthor(id: ID!): Response
`

export default `
  type Author {
    ${AuthorFields}
  }

  type Query{
    ${AuthorQueries}
  }

  type Mutation{
    ${AuthorMutations}
  }`
