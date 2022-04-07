import propTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import Image from 'next/image'
import { useEffect, useState } from 'react'
/**
 * RoomInfo component
 */
export default function RoomInfo(props) {
  //Since we are using SSR, the below code is necessary to make sure the component is mounted before showing the tooltip
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
      <div className="flex justify-center pb-1">
        <button
          onClick={() =>
            console.log(`Player ${props.playerName} wants out of here!`)
          }
          className="bg-red-700 border border-gray-400 inline-flex justify-center items-center rounded pr-1 mt-1 hover:bg-red-600 active:bg-red-800 focus:bg-red-600"
        >
          <span className="pl-3 text-white font-display font-bold">
            {props.t.leaveImgAlt}
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
}
