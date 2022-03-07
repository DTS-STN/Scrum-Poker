import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import TextInput from './TextInput'

expect.extend(toHaveNoViolations)

describe('TextInput', () => {
  it('renders TextInput', () => {
    const primary = render(
      <TextInput id="testID" label="test" placeholder="placeholder test">
        <p>test</p>
      </TextInput>
    )
    expect(primary).toBeTruthy()
    expect(primary.findByText('test')).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <TextInput id="testID" label="test" placeholder="placeholder test">
        <p>test</p>
      </TextInput>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
