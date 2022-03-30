import { COOKIE_NAME_PRERENDER_BYPASS } from 'next/dist/server/api-utils'
import propTypes from 'prop-types'

/**
 * ChatRoom component
 */
export default function ChatRoom(props) {
  //
  return (
    <div
      className={`h-auto w-auto my-4 rounded-lg bg-white border border-[#26374A] text-[14px]`}
      id={props.id}
    >
      {/* Current user */}
      <div className="flex justify-end w-full h-auto border-b-[#26374A] border-b p-1 pr-2 text-[16px]">
        {props.name}
      </div>

      {/* Message Box  */}
      <div className="flex w-full h-auto border-b-[#26374A] border-b p-1 text-left ">
        <ul className="w-full px-1">
          <li>&nbsp;</li>
          {props.messages.map((message) => (
            <li
              className={`flex p-1 ${
                message.name === props.name
                  ? 'justify-end  bg-gray-100'
                  : 'justify-start'
              }`}
              key={message.id}
            >
              <span
                className={` ${
                  message.name !== props.name
                    ? ' w-auto py-1 px-2 border rounded-2xl bg-[#335075] text-white justify-center'
                    : ''
                }`}
              >
                {message.name !== props.name ? message.name : ''}
              </span>
              &nbsp;
              <span
                className={` ${
                  message.name !== props.name
                    ? ' bg-[#335075] text-white py-1 px-2 border rounded-xl '
                    : ''
                }`}
              >
                {message.message}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Send a message inputbox */}
      <div className="flex p-1">
        <div className="flex w-11/12 px-3">
          <input
            type="text"
            id={`${props.id}-input`}
            name={props.id}
            aria-label={props.t.placeHolder}
            placeholder={props.t.placeholder}
            className="appearance-none border-gray-400 border w-full my-2 p-1 text-gray-700 leading-tight focus:outline-none focus:drop-shadow focus:ring-2 focus:ring-inset focus:ring-gray-600"
          />
        </div>
        <div className="flex w-1/12 text-right">
          <button
            type="button"
            id={`${props.id}-send`}
            onClick={() => copyToClipboard()}
            className="w-24 font-display my-2 mx-2 text-white bg-[#26374A] hover:bg-[#1C578A] active:bg-[#16446C] focus:bg-[#1C578A] rounded border border-[#091C2D] text-[14px]"
          >
            {props.t.send}
          </button>
        </div>
      </div>
    </div>
  )
}

ChatRoom.defaultProps = {
  id: 'ChatRoom',
  name: 'Skywalker',
  messages: [
    { id: '1', name: 'Doe', message: 'Hi ' },
    { id: '2', name: 'Jane', message: 'Hi Back' },
  ],
  t: {
    placeHolder: 'Write a message',
    send: 'Send',
  },
}

ChatRoom.propTypes = {
  // id of the element for testing if needed
  id: propTypes.string,

  // current user name
  name: propTypes.string,

  // messages
  messages: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string,
      name: propTypes.string,
      message: propTypes.string,
    })
  ).isRequired,

  // translations for labels
  t: propTypes.object,
}
