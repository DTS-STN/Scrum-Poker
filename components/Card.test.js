import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import Card from './Card'

expect.extend(toHaveNoViolations)

const fakeCard = { id: 'card-1', src: '/Card_1.svg', value: 1 }

describe('Card', () => {
  it('renders Card', () => {
    const primary = render(
      <ul>
        <Card
          src={fakeCard.src}
          id={fakeCard.id}
          key={fakeCard.id}
          alt={fakeCard.alt}
          selected
          onClick={() => {}}
        />
      </ul>
    )
    expect(primary).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    await act(async () => {
      const { container } = render(
        <ul>
          <Card
            src={fakeCard.src}
            id={fakeCard.id}
            key={fakeCard.id}
            alt={fakeCard.alt}
            selected
            onClick={() => {}}
          />
        </ul>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
