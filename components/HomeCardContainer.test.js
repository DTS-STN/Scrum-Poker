import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import HomeCardContainer from './HomeCardContainer'

expect.extend(toHaveNoViolations)

describe('HomeCardContainer', () => {
  it('renders HomeCardContainer', () => {
    const primary = render(
      <HomeCardContainer title="title" desh="short desc">
        <p>test</p>
      </HomeCardContainer>
    )
    expect(primary).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <HomeCardContainer title="title" desh="short desc">
        <p>test</p>
      </HomeCardContainer>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
