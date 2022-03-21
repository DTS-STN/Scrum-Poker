/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ErrorLabel } from './ErrorLabel'

const message = 'This is an error!'

expect.extend(toHaveNoViolations)

describe('ErrorLabel', () => {
  it('renders text correctly on the page', () => {
    render(<ErrorLabel message={message} />)
    expect(screen.getByText(message)).toBeTruthy()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<ErrorLabel message={message} />)
    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
