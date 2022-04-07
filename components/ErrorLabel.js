import PropTypes from 'prop-types'

/**
 * error label component that is used with form inputs to display error messages
 */
export function ErrorLabel(props) {
  return (
    <div
      className={`border-l-4 border-[#D3080C] mt-2 sm:-mb-6 px-10 py-2 md:mb-0 bg-[#F3E9E8] font-body font-bold text-sm lg:text-p ${props.className}`}
    >
      {props.message}
    </div>
  )
}

ErrorLabel.propTypes = {
  /**
   * The message that you want to show in the error label
   */
  message: PropTypes.string.isRequired,

  /**
   * Prop to add custom styling
   */
  className: PropTypes.string,
}
