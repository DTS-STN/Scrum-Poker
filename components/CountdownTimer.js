import React from 'react'
import Countdown from 'react-countdown'

// Renderer callback with condition
const renderer = ({ minutes, seconds, completed, props }) => {
  if (completed) {
    return (
      <span className="w-auto px-2 rounded border-2 border-[#F35568] text-[16px]">
        {props.timeIsUpText}
      </span>
    )
  }

  let borderColor = '#AAA'
  if (minutes === 0 && seconds <= 30 && seconds > 10) {
    borderColor = '#FFC923'
  } else if (minutes === 0 && seconds <= 10) {
    borderColor = '#F35568'
  }

  const className = `w-16 px-2 text-center rounded border-2 text-[16px]`
  const displayMinute = minutes < 10 ? `0${minutes}` : minutes
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds
  // Render a countdown
  return (
    <>
      <span className={className} style={{ borderColor }}>
        {displayMinute}:{displaySeconds}
      </span>
    </>
  )
}

const CountdownTimer = (props) => {
  return (
    <Countdown
      date={Date.now() + props.duration}
      renderer={renderer}
      timeIsUpText={props.timeIsUpText}
    />
  )
}

export default CountdownTimer
