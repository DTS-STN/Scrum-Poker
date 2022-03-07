import propTypes from 'prop-types'

/**
 * Simple HomeCardContainer component
 */
export default function HomeCardContainer(props) {
  return (
    <div className="rounded border border-gray-400 text-center p-4 flex flex-col md:w-96">
      {props.children}
    </div>
  )
}
