import propTypes, { number } from 'prop-types'
import ReactTooltip from 'react-tooltip'
import Image from 'next/image'
import CountdownTimer from './CountdownTimer'
import React, { useEffect, useState } from 'react'
/**
 * RoomInfo component
 */

const BUTTON_NAME = {
  START: { name: 'start', type: 1 },
  RESET: { name: 'reset', type: 2 },
}

const TimerSelect = (props) => {
  const durationArray = [
    { value: 0.5, description: `30 ${props.timerLabels.seconds}` },
    { value: 1, description: `1 ${props.timerLabels.minute}` },
    { value: 2, description: `2 ${props.timerLabels.minutes}` },
  ]

  return (
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
}

// define timer content for different scenarios
const TimerContent = React.memo((props) => {
  // content on host screen when timestamp is not set
  if (props.isHost && props.timestamp === null) {
    return (
      <TimerSelect
        setDuration={props.setDuration}
        timerLabels={props.timerLabels}
      />
    )
  } else if (props.timestamp && Date.now() - Number(props.timestamp) >= 1000) {
    const difference = Math.ceil(Date.now() - Number(props.timestamp))
    return (
      <CountdownTimer
        duration={props.duration - difference}
        timeIsUpText={props.timerLabels.timeIsUp}
      />
    )
  } else if (props.timestamp && Date.now() - Number(props.timestamp) < 1000) {
    return (
      <CountdownTimer
        duration={props.duration}
        timeIsUpText={props.timerLabels.timeIsUp}
      />
    )
  } else {
    return ''
  }
})

const TimerButton = ({ buttonText, buttonType, handleStartTimerClick }) => {
  return (
    <button
      type="button"
      className="w-auto px-2 ml-1 sm:text-base font-bold md:w-auto md:mt-0 sm:w-32 font-display ml-2 text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] rounded border border-[#091C2D] text-[12px]"
      onClick={() => handleStartTimerClick(buttonType)}
    >
      {buttonText}
    </button>
  )
}

const TimerSection = (props) => {
  const setDuration = React.useCallback(props.setDuration, [])
  const setButton = React.useCallback(props.setButton, [])
  const buttonText = props.timerLabels[props.currentButton.name]

  return (
    <>
      <TimerContent
        timestamp={props.timestamp}
        duration={props.duration}
        setDuration={setDuration}
        isHost={props.isHost}
        setButton={setButton}
        timerLabels={props.timerLabels}
      />
      {props.isHost && (
        <TimerButton
          buttonText={buttonText}
          buttonType={props.currentButton.type}
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
  const [currentButton, setButton] = useState(BUTTON_NAME.START)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleStartTimerClick = (type) => {
    let timestamp = null
    let timerDuration = null
    if (type === BUTTON_NAME.START.type) {
      timestamp = Date.now().toString()
      timerDuration = Number(duration)
      setButton(BUTTON_NAME.RESET)
    } else if (type === BUTTON_NAME.RESET.type) {
      timestamp = null
      timerDuration = null
      setDuration(0.5)
      setButton(BUTTON_NAME.START)
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
  const timerLabels = {
    seconds: props.t.seconds,
    minute: props.t.minute,
    minutes: props.t.minutes,
    timeIsUp: props.t.timeIsUp,
    start: props.t.start,
    reset: props.t.reset,
  }

  console.log('props.t', props.t)

  return (
    <div
      className={`h-auto w-auto rounded-md bg-white border-2 `}
      id={props.id}
    >
      <div className="flex align-baseline justify-between border-b-2 pl-1 bg-gray-200 py-0.5 pr-0.5">
        <div className="flex-1 font-bold text-lg lg:text-base xl:text-lg font-body text-slate-700 ">
          {props.t.roomId}
        </div>
        <div className="flex flex-nowrap text-right font-bold text-lg lg:text-base lg:my-auto xl:text-lg font-body text-slate-700 ">
          {props.roomId}
          <button
            data-tip
            data-for="copy"
            data-event="click"
            type="button"
            className="w-auto px-2 font-display ml-2 text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] rounded border border-[#091C2D] text-[12px]"
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
        <div className="flex-1 w-48 font-semibold font-body text-slate-700">
          {props.t.playerName}
        </div>
        <div className="flex-1 w-48 text-right font-semibold font-body text-slate-700">
          {props.playerName}
        </div>
      </div>
      <div className="flex p-1">
        <div className="flex-1 w-48 font-semibold font-body text-slate-700">
          {props.t.playersOnline}
        </div>
        <div className="flex-1 w-48 text-right font-semibold font-body text-slate-700">
          {props.playersOnline}
        </div>
      </div>
      <div className="flex p-1 mb-2 flex-wrap">
        <div className="flex-1 w-48 font-semibold font-body text-slate-700">
          {props.t.timer}
        </div>
        <TimerSection
          handleStartTimerClick={handleStartTimerClick}
          duration={timerDuration}
          setDuration={setDuration}
          isHost={props.isHost}
          timestamp={timestamp}
          currentButton={currentButton}
          setButton={setButton}
          timerLabels={timerLabels}
        />
      </div>
      <div className="flex justify-center pb-1">
        <button
          onClick={() =>
            console.log(`Player ${props.playerName} wants out of here!`)
          }
          className="bg-red-700 border border-gray-400 inline-flex justify-center items-center rounded pr-1 mt-1 hover:bg-red-600 active:bg-red-800 focus:bg-red-600"
        >
          <span className="pl-3 text-white font-display font-bold">
            {props.t.leaveRoom}
          </span>
          <Image
            src="/leaveRoom.svg"
            alt={props.t.leaveImgAlt}
            width={36}
            height={32}
            data-testid="blank-card-img"
          />
        </button>
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
