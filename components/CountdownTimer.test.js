import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CountdownTimer from './CountdownTimer'

describe('CountdownTimer test', () => {
  it('should render a countdown timer', () => {
    jest.useFakeTimers()
    render(<CountdownTimer duration={10000} timeIsUpText={'time is up'} />)
    const timerText = screen.getByText('00:10')
    expect(timerText).toBeInTheDocument()
    setTimeout(() => {
      const timeIsUp = screen.getByText('time is up')
      expect(timeIsUp).toBeInTheDocument()
    }, 10001)
    jest.runAllTimers()
  })
})
