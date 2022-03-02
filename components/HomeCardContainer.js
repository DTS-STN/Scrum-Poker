import propTypes from 'prop-types'

/**
 * Simple HomeCardContainer component
 */
export default function HomeCardContainer(props) {
  return (
    <div className="rounded overflow-hidden border border-gray-400 text-center p-4">
      <h1 className="text-opacity-75 text-black font-bold text-2xl">
        {props.title}
      </h1>
      <h2 className="text-opacity-75 text-black text-xl">{props.desc}</h2>
      {props.children}
    </div>
  )
}

HomeCardContainer.defaultProps = {
  title: 'Title',
  desc: 'Description',
  label: 'Label',
  placeholder: 'Placeholder',
  buttonText: 'Button Text',
}

HomeCardContainer.propTypes = {
  // Button Text
  buttonText: propTypes.string,

  // Title Text
  title: propTypes.string,

  // Description Text
  desc: propTypes.string,

  // Label Text
  label: propTypes.string,

  // Placeholder Text
  placeholder: propTypes.string,
}
