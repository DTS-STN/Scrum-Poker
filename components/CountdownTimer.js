import React from 'react'
import Countdown from 'react-countdown'

// Random component
const Completionist = () => <span>You are good to go!</span>

// Renderer callback with condition
const renderer = ({ _, minutes, seconds, completed }) => {
  let borderColor = '[#FFF]'
  if (minutes === 0 && seconds <= 30 && seconds > 10) {
    borderColor = '[#FFC923]'
  } else if (minutes === 0 && seconds <= 10) {
    borderColor = '[#F35568]'
  }

  const className = `w-auto px-2 rounded border border-${borderColor} text-[16px]`

  // Render a countdown
  return (
    <span className={className}>
      {minutes}:{seconds}
    </span>
  )
}

const CountdownTimer = (props) => {
  console.log('CountdownTimer props', props)
  return <Countdown date={Date.now() + props.duration} renderer={renderer} />
}

export default CountdownTimer
