import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import HomeCardContainer from './HomeCardContainer'

expect.extend(toHaveNoViolations)

describe('HomeCardContainer', () => {
  it('renders HomeCardContainer', () => {
    const primary = render(
      <HomeCardContainer>
        <p>test</p>
      </HomeCardContainer>
    )
    const footerLink = primary.getByText('test')
    expect(footerLink).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <HomeCardContainer>
        <p>test</p>
      </HomeCardContainer>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
