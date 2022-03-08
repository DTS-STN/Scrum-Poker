import propTypes from 'prop-types'

/**
 * Simple HomeCardContainer component
 */
export default function HomeCardContainer(props) {
  return (
    <div className="rounded border border-gray-400 text-center p-4 flex flex-col md:w-96">
      <div>
        <h1 className="text-opacity-75 text-black font-bold text-2xl">
          {props.title}
        </h1>
        <h2 className="text-opacity-75 text-black text-xl">{props.desc}</h2>
      </div>
      {props.children}
    </div>
  )
}

HomeCardContainer.defaultProps = {
  title: 'Title',
  desc: 'Description',
}

HomeCardContainer.propTypes = {
  // Title Text
  title: propTypes.string,

  // Description Text
  desc: propTypes.string,
}