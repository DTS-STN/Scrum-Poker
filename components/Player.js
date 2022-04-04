import propTypes from 'prop-types'
import Card from './Card'
import Image from 'next/image'
import ReactTooltip from 'react-tooltip'
import { useEffect, useState } from 'react'

/**
 * Player list component
 */
export default function Player(props) {
  //Since we are using SSR, the below code is necessary to make sure the component is mounted before showing the tooltip
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="flex md:flex-col rounded border border-slate-300 my-2">
      <div className=" flex w-full justify-between">
        <div className="flex ">
          <div className={`flex items-center justify-center rounded-lg p-2 `}>
            <span
              className={` bg-slate-300 flex justify-center rounded-full h-14 w-14  ${props.bgColor}`}
            >
              <span
                className="m-auto font-bold text-xl font-body"
                data-testid="first-letter"
              >
                {props.playerName.charAt(0).toUpperCase()}
              </span>
            </span>
          </div>

          <p
            className="px-2 my-auto text-body font-body font-semibold text-slate-700"
            data-testid="player-name"
          >
            {props.playerName}
          </p>
          {isMounted && props.host ? (
            <div className="inline-flex">
              <Image
                src="/Host_Crown.svg"
                alt="Room owner"
                width={15}
                height={10}
                data-for="host"
                data-tip="Room Owner"
                aria-controls="host"
              />
              <ReactTooltip
                id="host"
                effect="solid"
                place="right"
                className="font-display font-bold text-xs !bg-[#1A2838] text-white"
                role="status"
              />
            </div>
          ) : (
            ''
          )}
        </div>

        {props.selectedCard ? (
          <Card
            src={props.selectedCard.src}
            id={props.selectedCard.id}
            key={props.selectedCard.id}
            alt={props.selectedCard.alt}
            className=" "
            data-testid="selected-card-img"
          />
        ) : (
          <div className=" h-auto w-20 p-2">
            <Image
              src="/EmptyCard.svg"
              alt={props.imgAlt}
              width={74}
              height={102}
              layout="responsive"
              data-testid="blank-card-img"
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
  playerName: propTypes.string.isRequired,

  // card selected
  selectedCard: propTypes.object,

  // background colour of the circle if it needs to be changed
  bgColour: propTypes.string,

  // Alt text of the image
  imgAlt: propTypes.string,

  // Boolean for room host, shows crown next to name if true
  host: propTypes.bool,
}
