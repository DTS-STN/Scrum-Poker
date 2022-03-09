import propTypes from 'prop-types'
import Card from './Card'

/**
 * Player list component
 */
export default function Player(props) {
  return (
    <div className="flex md:flex-col rounded border border-slate-300 my-2">
      <div className=" flex w-full justify-between">
        <div className="flex ">
          <div
            className={`flex items-center justify-center rounded-lg p-2  ${props.bgColor}`}
          >
            <span className="   bg-slate-300 rounded-full h-14 w-14 ">
              {props.letter}
            </span>
          </div>

          <p className="px-2 my-auto text-body font-body font-semibold text-slate-700">
            {props.playerName}
          </p>
        </div>

        {/* <p className="px-6 my-auto">{props.playerCard}</p> */}

        {props.selectedCard ? (
          <Card
            src={props.selectedCard.src}
            id={props.selectedCard.id}
            key={props.selectedCard.id}
            alt={props.selectedCard.alt}
            className=" "
          />
        ) : (
          'other peoples cards here'
        )}
        {/*We can pass the back of the card image in the else statement above. (where the two single quotes are)*/}
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

  // letter
  letter: propTypes.string,

  // background colour of the circle if it needs to be changed
  bgColour: propTypes.string,

  // id of the element for testing if needed
  id: propTypes.string,
}
