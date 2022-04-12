import PropTypes from 'prop-types'

export default function FormButton(props) {
  return (
    <button
      type="submit"
      className="w-max font-display text-white bg-[#318000] hover:bg-[#1D4D00] active:bg-[#102900] py-3 px-5 rounded mt-12 focus:drop-shadow focus:ring-2 focus:ring-gray-600 border border-[#458259] text-[22px] leading-8 [text-shadow:1px_2px_0px_#333]"
    >
      {props.text}
    </button>
  )
}

FormButton.propTypes = {
  text: PropTypes.string,
}
