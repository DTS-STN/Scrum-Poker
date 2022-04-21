import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ApolloProvider } from '@apollo/client'
import client from '../graphql/client'
import ChatRoom from './ChatRoom'

expect.extend(toHaveNoViolations)

const testMessages = [
  { id: '1', name: 'Yoda', message: 'You must unlearn what you have learned' },
  { id: '2', name: 'Skywalker', message: 'All right. I’ll give it a try' },
  { id: '3', name: 'Yoda', message: 'No. Try not.' },
  { id: '4', name: 'Yoda', message: 'Do… or do not.' },
  { id: '5', name: 'Yoda', message: 'There is no try' },
]

const chatRoomInfo = {
  id: 'chatRoom',
  name: 'Skywalker',
  messages: testMessages,
}

describe('ChatRoom', () => {
  it('renders ChatRoom', () => {
    const primary = render(
      <ApolloProvider client={client}>
        <ChatRoom
          id={chatRoomInfo.id}
          name={chatRoomInfo.name}
          messages={chatRoomInfo.messages}
        />
      </ApolloProvider>
    )
    expect(primary).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <ApolloProvider client={client}>
        <ChatRoom
          id={chatRoomInfo.id}
          name={chatRoomInfo.name}
          messages={chatRoomInfo.messages}
        />
      </ApolloProvider>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
