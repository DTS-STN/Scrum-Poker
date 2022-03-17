/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../pages/home'
import GET_ROOMS_QUERY from '../../graphql/queries/getRoom.graphql'
import { MockedProvider } from '@apollo/client/testing'

import { getStaticProps } from '../../pages/home'

import { useRouter } from 'next/router'

// mocks useRouter to be able to use component' router.asPath
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

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

  const mockErrorData = {
    request: {
      query: GET_ROOMS_QUERY,
    },
    error: new Error('Network Error'),
  }

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      pathname: '/',
      asPath: '/',
    }))
  })

  it('should render the page successfully', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[mockRoomData]}>
        <Home locale="en" />
      </MockedProvider>
    )
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(screen).toBeTruthy()
    const heading = screen.getByTestId('homeContent')
    expect(heading).toBeInTheDocument()
  })

  it('should render the page in error state', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[mockErrorData]}>
        <Home locale="en" />
      </MockedProvider>
    )
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(screen).toBeTruthy()
    const heading = screen.getByTestId('errorState')
    expect(heading).toBeInTheDocument()
  })

  it('should render the page in loading state', () => {
    render(
      <MockedProvider addTypename={false} mocks={[mockRoomData]}>
        <Home locale="en" />
      </MockedProvider>
    )
    expect(screen).toBeTruthy()
    const heading = screen.getByTestId('loadingState')
    expect(heading).toBeInTheDocument()
  })

  it('should render the page successfully', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[mockRoomData]}>
        <Home locale="en" />
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
            title: 'Next Template - Home',
          },
          data_fr: {
            author: 'Service Canada',
            desc: 'Français',
            keywords: '',
            title: 'Next Template - Accueil',
          },
        },
      },
    })
  })
})
