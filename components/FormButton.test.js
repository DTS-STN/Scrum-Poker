import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import FormButton from './FormButton'

expect.extend(toHaveNoViolations)

describe('Button', () => {
  it('renders Button', () => {
    const primary = render(<FormButton text="Test" />)
    expect(primary).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<FormButton text="Test" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
