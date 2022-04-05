import propTypes from 'prop-types'

/**
 * ChatRoom component
 */
export default function ChatRoom(props) {
  // submit the message
  function submitMsg() {
    return true
  }

  //
  return (
    <div
      className={`h-auto w-auto mt-6 rounded-md bg-white border-2 text-[12px]`}
      id={props.id}
    >
      {/* Current user */}
      <div className="flex justify-end w-full h-auto border-b-2 p-1 pr-2 text-[14px]">
        {props.name}
      </div>

      {/* Message Box  */}
      <div className="relative w-full overflow-y-auto max-h-96 min-h-[24rem] border-b-2 p-1 text-left ">
        <ul className="w-full space-y-1">
          {props.messages.map((message) => (
            <li
              className={`flex w-auto pt-0.5
                ${
                  message.name === props.name ? 'justify-end ' : 'justify-start'
                }`}
              key={message.id}
            >
              <div
                className={` ${
                  message.name !== props.name
                    ? 'py-1 px-1 border rounded-md bg-[#335075] text-white'
                    : 'py-1 px-1 border rounded-md bg-gray-200'
                }`}
              >
                <div className="text-[10px]">
                  {message.name !== props.name ? message.name : ''}
                </div>
                <div className="text-[12px]">{message.message}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Send a message inputbox */}
      <div className="flex p-1">
        <div className="flex w-11/12">
          <input
            type="text"
            id={`${props.id}-input`}
            name={props.id}
            aria-label={props.t.placeHolder}
            placeholder={props.t.placeholder}
            className="appearance-none rounded-md border-gray-400 border w-full my-2 p-1 text-gray-700 leading-tight focus:outline-none focus:drop-shadow focus:ring-2 focus:ring-inset focus:ring-gray-600"
          />
        </div>
        <div className="flex w-1/12 pl-0.5 text-right">
          <button
            type="button"
            id={`${props.id}-send`}
            onClick={() => submitMsg()}
            className="w-auto h-6 font-display my-2 text-white text-[12px]"
          >
            <svg
              className="fill-[#26374A] hover:fill-[#1C578A] active:fill-[#16446C] focus:fill-[#1C578A] origin-center transform rotate-90"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
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
