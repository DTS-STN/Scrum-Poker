import PropTypes from 'prop-types'

//error label component that is used with form inputs to display error messages

export function ErrorLabel(props) {
  return (
    <div
      className={`appearance-none ${
        !props.serverError
          ? 'rounded-r-lg border-l-4 text-sm'
          : 'border text-md'
      } border-[#D3080C] mt-2 sm:-mb-6 px-10 py-2 md:mb-0 bg-[#F3E9E8] font-body font-bold lg:text-p ${
        props.className
      }`}
      id={props.errorId}
      aria-live="polite"
      aria-hidden={props.hidden}
      hidden={props.hidden}
    >
      <span className="inline-flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="#D3080C"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>{' '}
      </span>
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
