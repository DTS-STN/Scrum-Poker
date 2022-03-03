import propTypes from 'prop-types'

export default function TextInput(props) {
  return (
    <div className="mt-6">
      <label
        htmlFor={props.id}
        className="block rounded-t-lg border-t border-l border-r border-gray-300 px-3 py-2 bg-gray-300"
      >
        {props.label}
      </label>
      <input
        type="text"
        id={props.id}
        name={props.id}
        placeholder={props.placeholder}
        className="appearance-none border-gray-300 border-b border-x w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
}
