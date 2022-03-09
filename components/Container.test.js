import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import Container from './Container'

expect.extend(toHaveNoViolations)

describe('Container', () => {
  it('renders Container', () => {
    const primary = render(
      <Container title="title" desh="short desc">
        <p>test</p>
      </Container>
    )
    expect(primary).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Container title="title" desh="short desc">
        <p>test</p>
      </Container>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
