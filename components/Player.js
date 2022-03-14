import propTypes from 'prop-types'
import Card from './Card'
import Image from 'next/image'

/**
 * Player list component
 */
export default function Player(props) {
  return (
    <div className="flex md:flex-col rounded border border-slate-300 my-2">
      <div className=" flex w-full justify-between">
        <div className="flex ">
          <div className={`flex items-center justify-center rounded-lg p-2`}>
            <span
              className={`   bg-slate-300 rounded-full h-14 w-14 relative ${props.bgColor}`}
            >
              <span className="left-5 top-3 font-bold text-xl font-body absolute">
                {props.playerName.charAt(0).toUpperCase()}
              </span>
            </span>
          </div>

          <p className="px-2 my-auto text-body font-body font-semibold text-slate-700">
            {props.playerName}
          </p>
        </div>

        {props.selectedCard ? (
          <Card
            src={props.selectedCard.src}
            id={props.selectedCard.id}
            key={props.selectedCard.id}
            alt={props.selectedCard.alt}
            className=" "
          />
        ) : (
          <div className=" h-auto w-20 p-2">
            <Image
              src="/EmptyCard.svg"
              alt={props.imgAlt}
              width={74}
              height={102}
              layout="responsive"
            />
          </div>
        )}
      </div>
      {props.children}
    </div>
  )
}

Player.propTypes = {
  // player name to be displayed
  playerName: propTypes.string,

  // card selected
  selectedCard: propTypes.object,

  // letter
  letter: propTypes.string,

  // background colour of the circle if it needs to be changed
  bgColour: propTypes.string,

  // id of the element for testing if needed
  id: propTypes.string,

  // Alt text of the image
  imgAlt: propTypes.string,
}