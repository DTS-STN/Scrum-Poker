import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import Player from './Player'

expect.extend(toHaveNoViolations)

describe('Player list', () => {
  const playerName = 'Bob'

  it('should render a player name', () => {
    render(<Player playerName={playerName} />)
    const playerListName = screen.getByText('Bob')
    expect(playerListName).toBeInTheDocument()
  })

  it('should render the first letter of the player name', () => {
    render(<Player playerName={playerName} />)
    const letter = screen.getByTestId('first-letter')
    expect(letter).toHaveTextContent(/b/i)
  })

  it('should render the empty card image', async () => {
    await act(async () => {
      render(<Player playerName={playerName} src="/" imgAlt="" />)
      const image = screen.getByTestId('blank-card-img')
      expect(image).toBeInTheDocument()
    })
  })

  it('has no a11y violations', async () => {
    await act(async () => {
      const { container } = render(
        <Player playerName={playerName} src="/" imgAlt="" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
