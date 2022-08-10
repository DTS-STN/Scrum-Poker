import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ApolloProvider } from '@apollo/client'
import client from '../graphql/client'
import CreateRoom from './CreateRoom'

expect.extend(toHaveNoViolations)

describe('CreateRoom', () => {
  it('renders CreateRoom component', () => {
    const primary = render(
      <ApolloProvider client={client}>
        <CreateRoom locale="en" />
      </ApolloProvider>
    )
    expect(primary).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <ApolloProvider client={client}>
        <CreateRoom locale="en" />
      </ApolloProvider>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
