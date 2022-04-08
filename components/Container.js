import propTypes from 'prop-types'

/**
 * Simple Container component
 */
export default function Container(props) {
  return (
    <div
      className={`rounded border border-gray-400 shadow-md shadow-gray-900/50 text-center p-4 flex flex-col sm:w-96  ${props.className}`}
    >
      {props.children}
    </div>
  )
}

Container.defaultProps = {
  className: '',
}

Container.propTypes = {
  // style for teh container
  className: propTypes.string,
}
