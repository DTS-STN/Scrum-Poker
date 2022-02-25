import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import Card from './Card'

expect.extend(toHaveNoViolations)

const fakeCard = { id: 'card-1', src: '/king_of_spades.svg', value: 1 }

describe('Card', () => {
  it('renders Card', () => {
    const primary = render(
      <Card
        src={fakeCard.src}
        id={fakeCard.id}
        key={fakeCard.id}
        alt={fakeCard.alt}
      />
    )
    expect(primary).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Card
        src={fakeCard.src}
        id={fakeCard.id}
        key={fakeCard.id}
        alt={fakeCard.alt}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
