import propTypes from 'prop-types'
import Image from 'next/image'
/**
 * Simple Card component
 */
export default function Card(props) {
  return (
    <div
      className={`hover:cursor-pointer h-auto w-48 mx-auto md:w-44 block ${
        props.selected
          ? `border-4 border-canadaBlue rounded-lg`
          : `border border-slate-300`
      }`}
      onClick={props.onClick}
    >
      <Image
        id={props.id}
        src={props.src}
        alt={props.alt}
        width={74}
        height={102}
        layout="responsive"
        className={props.className}
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
