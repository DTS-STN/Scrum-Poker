import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CountdownTimer from './CountdownTimer'

describe('CountdownTimer test', () => {
  it('should render a countdown timer', () => {
    render(<CountdownTimer duration={10000} timeIsUpText={'time is up'} />)
    const timerText = screen.getByText('00:10')
    expect(timerText).toBeInTheDocument()
  })
})
