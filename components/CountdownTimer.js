import React from 'react'
import Countdown from 'react-countdown'

// Renderer callback with condition
const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    return (
      <span className="w-auto px-2 rounded border border-[#F35568] text-[16px]">
        Time is up
      </span>
    )
  }

  let borderColor = '[#FFF]'
  if (minutes === 0 && seconds <= 30 && seconds > 10) {
    borderColor = '[#FFC923]'
  } else if (minutes === 0 && seconds <= 10) {
    borderColor = '[#F35568]'
  }

  const className = `w-16 px-2 text-center rounded border border-${borderColor} text-[16px]`
  const displayMinute = minutes < 10 ? `0${minutes}` : minutes
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds
  // Render a countdown
  return (
    <span className={className}>
      {displayMinute}:{displaySeconds}
    </span>
  )
}

const CountdownTimer = (props) => {
  return <Countdown date={Date.now() + props.duration} renderer={renderer} />
}

export default CountdownTimer
