import propTypes from 'prop-types'

/**
 * Simple Container component
 */
export default function Container(props) {
  return (
    <div className={`rounded border border-gray-400 ${props.style}`}>
      {props.children}
    </div>
  )
}

Container.defaultProps = {
  style: 'style',
}

Container.propTypes = {
  // style for the container
  style: propTypes.string,
}
