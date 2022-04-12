import PropTypes from 'prop-types'

//error label component that is used with form inputs to display error messages

export function ErrorLabel(props) {
  return (
    <div
      className={`appearance-none ${
        !props.serverError ? 'text-xs' : 'text-md'
      } border border-[#a81e20] text-gray-800 sm:-mb-6 px-10 py-2 md:mb-0 bg-[#F3E9E8] font-body font-bold lg:text-p ${
        props.className
      }`}
      id={props.errorId}
      aria-live="polite"
      aria-hidden={props.hidden}
      hidden={props.hidden}
    >
      {props.message}
    </div>
  )
}

ErrorLabel.propTypes = {
  //lets us set the label to invisible when there are no errors
  hidden: PropTypes.bool,
  //The message that you want to show in the error label
  message: PropTypes.string.isRequired,
  //Prop to add custom styling
  className: PropTypes.string,
  // id of the element for testing if needed
  errorId: PropTypes.string,
}
