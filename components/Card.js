import propTypes from 'prop-types'
import Image from 'next/image'
/**
 * Simple Card component
 */
export default function Card(props) {
  return (
    <div
      className={`hover:cursor-pointer h-auto w-auto focus:rounded-lg focus:ring focus:ring-gray-600 ${
        props.selected
          ? `border-4 border-canadaBlue block rounded-lg focus:ring-0 `
          : props.className
          ? `h-auto w-14 p-1`
          : `border-1 border-slate-300 block hover:animate-pulsate-fwd`
      }`}
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      tabIndex="0"
    >
      <Image
        id={props.id}
        src={props.src}
        alt={props.alt}
        width={74}
        height={102}
        layout="responsive"
      ></Image>
    </div>
  )
}

Card.defaultProps = {
  id: 'card',
  alt: 'card image',
  src: 'src/address',
  className: '',
}

Card.propTypes = {
  // image to be displayed
  src: propTypes.string,

  // id of the element for testing if needed
  id: propTypes.string,

  // alt text for the card
  alt: propTypes.string,

  // style for the card
  className: propTypes.string,

  // if card is selected
  selected: propTypes.bool,

  // onClick function of the card
  onClick: propTypes.func,
}
