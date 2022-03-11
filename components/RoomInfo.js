import propTypes from 'prop-types'
/**
 * RoomInfo component
 */
export default function RoomInfo(props) {
  function copyToClipboard(props) {
    navigator.clipboard.writeText(props.roomId).then(
      function () {
        console.log('room id: ', props.roomId, ' copied to clipboard')
      },
      function () {
        console.log("didn't worked")
      }
    )
  }

  return (
    <div
      className={`h-auto w-72 my-4 rounded-lg bg-white border border-[#26374A]`}
      id={props.id}
    >
      <div className="flex border-b-[#26374A] border-b p-1 text-left">
        <div className="flex-initial w-48">Room Id:</div>
        <div className="flex-initial w-48 text-right">
          {props.roomId}
          <button
            type="button"
            onClick={() => copyToClipboard()}
            className="w-12 font-display ml-2 text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] rounded border border-[#091C2D] text-[12px]"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="flex p-1">
        <div className="flex-1 w-48">Player&apos;s Name:</div>
        <div className="flex-1 w-48 text-right">{props.playerName}</div>
      </div>
      <div className="flex p-1">
        <div className="flex-1 w-48 ">Players online:</div>
        <div className="flex-1 w-48 text-right">{props.playersOnline}</div>
      </div>
    </div>
  )
}

RoomInfo.defaultProps = {
  id: 'RoomInfo',
  playerName: 'My Name',
  playersOnline: '3',
  roomId: '2f3h9',
}

RoomInfo.propTypes = {
  // id of the element for testing if needed
  id: propTypes.string,

  // player's name as entered on the main page
  playerName: propTypes.string,

  // numbers of players online
  playersOnline: propTypes.string,

  // roomId of the room
  roomId: propTypes.string,
}
