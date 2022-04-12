/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../pages/home'
import GET_ROOMS_QUERY from '../../graphql/queries/getRoom.graphql'
import { MockedProvider } from '@apollo/client/testing'
import { UserIdContext } from '../../context/userIdContext'

import { getStaticProps } from '../../pages/home'

import { useRouter } from 'next/router'

// mocks useRouter to be able to use component' router.asPath
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const contextValues = { globalUserId: jest.fn(), setGlobalUserId: jest.fn() }

describe('Home page', () => {
  const mockRoomData = {
    request: {
      query: GET_ROOMS_QUERY,
    },
    result: {
      data: {
        rooms: [
          {
            id: '1',
            title: 'room test',
          },
        ],
      },
    },
  }

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      pathname: '/',
      asPath: '/',
      query: 'error=test',
    }))
  })

  it('should render the page successfully', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[mockRoomData]}>
        <UserIdContext.Provider value={contextValues}>
          <Home locale="en" />
        </UserIdContext.Provider>
      </MockedProvider>
    )
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(screen).toBeTruthy()
    const heading = screen.getByTestId('homeContent')
    expect(heading).toBeInTheDocument()
  })

  it('Test getStaticProps', async () => {
    const props = await getStaticProps({ locale: 'en' })

    expect(props).toEqual({
      props: {
        langToggleLink: '/fr/home',
        locale: 'en',
        meta: {
          data_en: {
            desc: 'English',
            author: 'Service Canada',
            keywords: '',
            title: 'Scrum Poker - Home',
          },
          data_fr: {
            author: 'Service Canada',
            desc: 'Français',
            keywords: '',
            title: 'Scrum Poker - Accueil',
          },
        },
      },
    })
  })
})
