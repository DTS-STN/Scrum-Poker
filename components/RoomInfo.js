import propTypes, { number } from 'prop-types'
import ReactTooltip from 'react-tooltip'
import Image from 'next/image'
import CountdownTimer from './CountdownTimer'
import React, { useEffect, useState } from 'react'
/**
 * RoomInfo component
 */

const BUTTON_NAME = {
  START: 'Start',
  RESET: 'Reset',
}

const durationArray = [
  { value: 0.5, description: '30 seconds' },
  { value: 1, description: '1 minute' },
  { value: 2, description: '2 minutes' },
]

const TimerSelect = (props) => (
  <div className="w-auto mx-1 px-1 border rounded border border-slate-500">
    <select
      name="duration"
      id="duration-select"
      onChange={(e) => props.setDuration(parseFloat(e.target.value))}
    >
      {durationArray.map((duration, index) => (
        <option value={duration.value} key={index}>
          {duration.description}
        </option>
      ))}
    </select>
  </div>
)

// define timer content for different scenarios
const TimerContent = React.memo((props) => {
  // content on host screen when timestamp is not set
  if (props.isHost && props.timestamp === null) {
    return <TimerSelect setDuration={props.setDuration} />
  } else if (props.timestamp && Date.now() - Number(props.timestamp) >= 1000) {
    const difference = Math.ceil(Date.now() - Number(props.timestamp))
    return (
      <CountdownTimer
        duration={props.duration - difference}
        setButtonName={props.setButtonName}
      />
    )
  } else if (props.timestamp && Date.now() - Number(props.timestamp) < 1000) {
    return (
      <CountdownTimer
        duration={props.duration}
        setButtonName={props.setButtonName}
      />
    )
  } else {
    return ''
  }
})

const TimerButton = ({ buttonName, handleStartTimerClick }) => {
  return (
    <button
      type="button"
      className="w-auto px-2 font-display ml-2 text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] rounded border border-[#091C2D] text-[12px]"
      onClick={() => handleStartTimerClick(buttonName)}
    >
      {buttonName}
    </button>
  )
}

const TimerSection = (props) => {
  const setDuration = React.useCallback(props.setDuration, [])
  const setButtonName = React.useCallback(props.setButtonName, [])
  return (
    <>
      <TimerContent
        timestamp={props.timestamp}
        duration={props.duration}
        setDuration={setDuration}
        isHost={props.isHost}
        setButtonName={setButtonName}
      />
      {props.isHost && (
        <TimerButton
          buttonName={props.buttonName}
          handleStartTimerClick={props.handleStartTimerClick}
        />
      )}
    </>
  )
}

export default function RoomInfo(props) {
  //Since we are using SSR, the below code is necessary to make sure the component is mounted before showing the tooltip
  const [isMounted, setIsMounted] = useState(false)
  const [duration, setDuration] = useState(0.5)
  const [buttonName, setButtonName] = useState(BUTTON_NAME.START)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleStartTimerClick = (action) => {
    let timestamp = null
    let timerDuration = null
    if (action === BUTTON_NAME.START) {
      timestamp = Date.now().toString()
      timerDuration = Number(duration)
      setButtonName(BUTTON_NAME.RESET)
    } else if (action === BUTTON_NAME.RESET || action === BUTTON_NAME.STOP) {
      timestamp = null
      timerDuration = null
      setDuration(0.5)
      setButtonName(BUTTON_NAME.START)
    }

    //Update the timer of the room
    props.updateRoom({
      variables: {
        updateRoomId: props.roomData.id,
        updateRoomUsers: props.roomData.userIds,
        isShown: props.roomData.isShown,
        timer: {
          timestamp: timestamp ? timestamp.toString() : timestamp,
          duration: timerDuration,
        },
      },
    })
  }

  const timerDuration = props.roomData.timer?.duration
    ? Number(props.roomData.timer.duration * 60 * 1000)
    : null
  const timestamp = props.roomData.timer?.timestamp
    ? Number(props.roomData.timer.timestamp)
    : null
  return (
    <div
      className={`h-auto w-72 my-4 rounded-lg bg-white border border-[#26374A]`}
      id={props.id}
    >
      <div className="flex border-b-[#26374A] border-b p-1 text-left">
        <div className="flex-initial w-48">{props.t.roomId}</div>
        <div className="flex-initial w-48 text-right">
          {props.roomData.id}
          <button
            data-tip
            data-for="copy"
            data-event="click"
            type="button"
            className="w-auto px-2 pt-1 font-display ml-2 text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] rounded border border-[#091C2D] text-[12px]"
          >
            <Image src="/copy.svg" alt={props.t.copy} width={11} height={11} />
          </button>
          {isMounted && (
            <ReactTooltip
              id="copy"
              effect="solid"
              clickable
              afterShow={() => {
                navigator.clipboard.writeText(props.roomId)
                setTimeout(() => ReactTooltip.hide(), 2000)
              }}
              data-place="top"
              className="font-display font-bold text-xs !bg-[#1A2838] text-white"
            >
              <span>{props.t.copied}</span>
            </ReactTooltip>
          )}
        </div>
      </div>

      <div className="flex p-1">
        <div className="flex-1 w-48">{props.t.playerName}</div>
        <div className="flex-1 w-48 text-right">{props.playerName}</div>
      </div>
      <div className="flex p-1">
        <div className="flex-1 w-48 ">{props.t.playersOnline}</div>
        <div className="flex-1 w-48 text-right">{props.playersOnline}</div>
      </div>
      <div className="flex p-1">
        <div className="flex-1 w-48 ">{props.t.timer}</div>
        <TimerSection
          handleStartTimerClick={handleStartTimerClick}
          duration={timerDuration}
          setDuration={setDuration}
          isHost={props.isHost}
          timestamp={timestamp}
          buttonName={buttonName}
          setButtonName={setButtonName}
        />
      </div>
    </div>
  )
}

RoomInfo.defaultProps = {
  id: 'RoomInfo',
  playerName: 'My Name',
  playersOnline: '3',
  roomId: '2f3h9',
  t: {
    roomId: 'Room Id:',
    playerName: 'Player&apos;s Name:',
    playersOnline: 'Players Online:',
    copy: 'Copy',
  },
}

RoomInfo.propTypes = {
  // id of the element for testing if needed
  id: propTypes.string,

  // player's name as entered on the main page
  playerName: propTypes.string,

  // numbers of players online
  playersOnline: propTypes.number,

  // roomId of the room
  roomId: propTypes.string,

  // translations for labels
  t: propTypes.object,

  // updateRoom mutation
  updateRoom: propTypes.func,
}
