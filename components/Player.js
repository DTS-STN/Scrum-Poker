import propTypes from 'prop-types'

/**
 * Simple Card component
 */
export default function Player(props) {
  return (
    <div className="flex md:flex-col justify-between rounded border border-slate-300 my-2 p-2">
      <div className=" flex justify-between bg-amber-100">
        <div className="flex">
          <p className="rounded-full p-4 m-2 bg-slate-300">N</p>
          <p className="px-2 my-auto text-lg font-body font-semibold text-slate-700">
            {props.playerName}
          </p>
        </div>

        <p className="px-6 my-auto">{props.playerCard}</p>
      </div>
      {props.children}
    </div>
  )
}

Player.propTypes = {
  // player name to be displayed
  playerName: propTypes.string,

  // card selected
  playerCard: propTypes.string,

  // id of the element for testing if needed
  id: propTypes.string,
}
