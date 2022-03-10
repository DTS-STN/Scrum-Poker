import propTypes from 'prop-types'

/**
 * Simple Container component
 */
export default function Container(props) {
  return (
    <div
      className={`rounded border border-gray-400 shadow-md shadow-gray-100 ${props.style}`}
    >
      {props.children}
    </div>
  )
}

Container.defaultProps = {
  style: '',
}

Container.propTypes = {
  // style for teh container
  style: propTypes.string,
}
