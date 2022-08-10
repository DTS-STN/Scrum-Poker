import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import TextInput from './TextInput'

expect.extend(toHaveNoViolations)

const fakeError = {
  message: 'Please enter your name (alphanumeric characters and spaces only)',
}
const register = () => {
  return null
}

describe('Button', () => {
  it('renders Button', () => {
    const primary = render(
      <TextInput
        register={register}
        id="room"
        label="Label"
        placeholder="Placeholder"
        required={false}
        errors={fakeError}
      />
    )
    expect(primary).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <TextInput
        register={register}
        id="room"
        label="Label"
        placeholder="Placeholder"
        required={false}
        errors={fakeError}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
