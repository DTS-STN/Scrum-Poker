import propTypes, { number } from 'prop-types'
import ReactTooltip from 'react-tooltip'
import Image from 'next/image'
import CountdownTimer from './CountdownTimer'
import { useEffect, useState } from 'react'
/**
 * RoomInfo component
 */
const START = 'START'
const STOP = 'STOP'

const TimerSelect = (props) => (
  <div className="w-20">
    <select
      name="duration"
      id="duration-select"
      onChange={(e) => props.setDuration(e.target.value)}
    >
      {[1, 2, 3, 4, 5].map((duration, index) => (
        <option value={duration} key={index}>
          {duration}
        </option>
      ))}
    </select>
    <span className="px-1">mins</span>
  </div>
)

// define timer content for different scenarios
const TimerContent = (props) => {
  // content on host screen when timestamp is not set
  if (props.isHost && props.timestamp === null) {
    return <TimerSelect setDuration={props.setDuration} />
  } else if (props.timestamp && Date.now() - Number(props.timestamp) >= 1000) {
    const difference = Math.ceil((Date.now() - Number(props.timestamp)) / 1000)
    console.log(1, props.timestamp, difference)
    return <CountdownTimer duration={props.duration - difference} />
  } else if (props.timestamp && Date.now() - Number(props.timestamp) < 1000) {
    console.log(2)
    return <CountdownTimer duration={props.duration} />
  } else {
    return ''
  }
}

const ButtonContent = (props) => {
  return props.isHost ? (
    props.isStartShown ? (
      <button
        type="button"
        className="w-auto px-2 pt-1 font-display ml-2 text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] rounded border border-[#091C2D] text-[12px]"
        onClick={() => props.handleStartTimerClick(START)}
      >
        Start
      </button>
    ) : (
      <button
        type="button"
        className="w-auto px-2 pt-1 font-display ml-2 text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] rounded border border-[#091C2D] text-[12px]"
        onClick={() => props.handleStartTimerClick(STOP)}
      >
        Stop
      </button>
    )
  ) : (
    ''
  )
}

const TimerSection = (props) => {
  console.log('TimerSection - duration', props)
  return (
    <>
      <TimerContent
        timestamp={props.timestamp}
        duration={props.duration}
        setDuration={props.setDuration}
        isHost={props.isHost}
      />
      <ButtonContent
        handleStartTimerClick={props.handleStartTimerClick}
        isStartShown={props.isStartShown}
        isHost={props.isHost}
      />
    </>
  )

  // return props.isStartShown
  //   ? (props.isHost ? (<>

  //     <button type='button'
  //       className="w-auto px-2 pt-1 font-display ml-2 text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] rounded border border-[#091C2D] text-[12px]"
  //       onClick={() => props.handleStartTimerClick(START)}
  //     >
  //       Start
  //     </button>
  //   </>) : "")
  //   : <>
  //     <CountdownTimer duration={props.duration} />
  //     <button type='button'
  //       className="w-auto px-2 pt-1 font-display ml-2 text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] rounded border border-[#091C2D] text-[12px]"
  //       onClick={() => props.handleStartTimerClick(STOP)}
  //     >
  //       Stop
  //     </button>
  //   </>
}

export default function RoomInfo(props) {
  //Since we are using SSR, the below code is necessary to make sure the component is mounted before showing the tooltip
  const [isMounted, setIsMounted] = useState(false)
  const [isStartShown, setIsStartShown] = useState(true)
  const [duration, setDuration] = useState(1)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleStartTimerClick = (action) => {
    //get current time
    const timestamp = action === 'START' ? Date.now().toString() : null

    const timerDuration = action === 'START' ? Number(duration) : null

    action === 'STOP' && setDuration(1)

    setIsStartShown(!isStartShown)

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

  const timerDuration = props.roomData.timer.duration
    ? Number(props.roomData.timer.duration * 60 * 1000)
    : null
  const timestamp = props.roomData.timer.timestamp
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
          isStartShown={isStartShown}
          isHost={props.isHost}
          timestamp={timestamp}
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
