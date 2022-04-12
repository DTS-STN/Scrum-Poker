import propTypes from 'prop-types'
import { ErrorLabel } from './ErrorLabel'

export default function TextInput(props) {
  const boxstyle =
    'appearance-none rounded-b-lg border-gray-300 border-b border-x w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:drop-shadow focus:ring-2 focus:ring-inset focus:ring-gray-600'

  return (
    <div className="mt-6 w-full">
      <ErrorLabel
        hidden={!props.errors}
        className="invalid-feedback"
        errorId={props.id + 'Label'}
        message={props.errors?.message ?? ''}
      ></ErrorLabel>
      <label
        htmlFor={props.id}
        className="block rounded-t-lg border-t border-l border-r border-gray-300 px-3 py-2 bg-gray-300"
      >
        {props.label}
        <span className="text-red-800 font-body" aria-hidden="true">
          {props.required}
        </span>
      </label>
      <input
        {...props.register(props.id)}
        type="text"
        id={props.id}
        name={props.id}
        placeholder={props.placeholder}
        aria-required="true"
        aria-describedby={props.errors?.message}
        aria-invalid={props.errors ? 'true' : 'false'}
        className={`form-control ${
          props.errors ? 'is-invalid ' + boxstyle : boxstyle
        }`}
      />
    </div>
  )
}

TextInput.defaultProps = {
  id: 'input',
  label: 'Label',
  placeholder: 'Placeholder',
}

TextInput.propTypes = {
  // Button Text
  id: propTypes.string,

  // Label Text
  label: propTypes.string,

  // Placeholder Text
  placeholder: propTypes.string,

  //required
  required: propTypes.string,

  // error id
  errors: propTypes.object,
}
