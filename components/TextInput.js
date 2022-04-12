import propTypes from 'prop-types'
import { ErrorLabel } from './ErrorLabel'

export default function TextInput(props) {
  const boxstyle =
    'appearance-none rounded-b-lg border-gray-300 border-b border-x w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:drop-shadow focus:ring-2 focus:ring-inset focus:ring-gray-600'
  const boxstyleErr =
    'appearance-none rounded-b-lg border-red-800 border-b border-x w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-inset focus:ring-red-500 focus:drop-shadow-[0_1px_1px_rgba(255,0,0)]'
  const labelstyle =
    'block rounded-t-lg border-t border-l border-r text-gray-800 font-semibold border-gray-300 px-3 py-2 bg-gray-300 mt-1'
  const labelstyleErr =
    'block rounded-t-lg border-t border-l border-r text-gray-800 font-semibold border-red-800 px-3 py-2 bg-gray-300 mt-1'

  return (
    <div className="mt-6 w-full">
      <label
        htmlFor={props.id}
        className={props.errors ? labelstyleErr : labelstyle}
      >
        {props.label}
        <span className="text-red-800 font-body" aria-hidden="true">
          {props.required}
        </span>
      </label>
      <ErrorLabel
        hidden={!props.errors}
        className="invalid-feedback"
        errorId={props.id + 'Label'}
        message={props.errors?.message ?? ''}
      />
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
          props.errors ? 'is-invalid ' + boxstyleErr : boxstyle
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
