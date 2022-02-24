const LibraryFields = `
  id: ID!
  name: String
  books: [Book]
`

const LibraryQueries = `
  libraries(id: ID): [Library]
`

const LibraryMutations = `
  addLibrary(id: ID!, name: String, books: [ID]): Response
  updateLibrary(id: ID!, name: String, books: [ID]): Response
  deleteLibrary(id: ID!): Response
`

export default `
  type Library {
    ${LibraryFields}
  }
  type Query{
    ${LibraryQueries}
  }

  type Mutation{
    ${LibraryMutations}
  }`
