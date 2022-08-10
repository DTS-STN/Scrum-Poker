import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ApolloProvider } from '@apollo/client'
import client from '../graphql/client'
import JoinRoom from './JoinRoom'

expect.extend(toHaveNoViolations)

describe('JoinRoom', () => {
  it('renders JoinRoom component', () => {
    const primary = render(
      <ApolloProvider client={client}>
        <JoinRoom locale="en" />
      </ApolloProvider>
    )
    expect(primary).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <ApolloProvider client={client}>
        <JoinRoom locale="en" />
      </ApolloProvider>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
