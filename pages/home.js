import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'
import Container from '../components/Container'
import TextInput from '../components/TextInput'

import { useMutation, useLazyQuery } from '@apollo/client'
import ADD_ROOM from '../graphql/mutations/addRoom.graphql'
import ADD_USER from '../graphql/mutations/addUser.graphql'
import GET_ROOM from '../graphql/queries/getRoom.graphql'
import UPDATE_ROOM from '../graphql/mutations/updateRoom.graphql'
import UPDATE_USER from '../graphql/mutations/updateUser.graphql'

import { useRouter } from 'next/router'
import { ErrorLabel } from '../components/ErrorLabel'
import { useState } from 'react'
import Cookies from 'js-cookie'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr

  const [createRoomError, setCreateRoomError] = useState(undefined)
  const [joinRoomError, setJoinRoomError] = useState(undefined)

  const router = useRouter()

  //Load GraphQL Data

  const [addRoom] = useMutation(ADD_ROOM)
  const [addUser] = useMutation(ADD_USER)
  const [updatedUser] = useMutation(UPDATE_USER)
  const [updateRoom] = useMutation(UPDATE_ROOM)
  const [getRoomUsers] = useLazyQuery(GET_ROOM)

  // Check for queryErrorCode from a redirect.

  const queryErrorCode = router.query.errorCode
  let errorCodeMsg = ''
  if (queryErrorCode)
    switch (queryErrorCode) {
      case '308':
        errorCodeMsg = t.noRoomExists
        break
      case '309':
        errorCodeMsg = t.noUserExists
        break
      case '310':
        errorCodeMsg = t.notRoomMember
        break
      default:
        errorCodeMsg = t.genericError
    }

  const handleJoinSubmit = async (e) => {
    //prevent default behaviour of form
    e.preventDefault()
    let username = newRoomName.value,
      userid = Cookies.get('userid'),
      room = roomCode.value

    try {
      //Check if name is empty
      if (username === '') {
        throw t.invalidNameError
      }
      //Check if name contains special characters
      else if (!/^([A-Za-z0-9\s\-\'?])+$/.test(username)) {
        throw t.invalidNameError
      }
      //Check if room code field is empty
      if (room === '') {
        throw t.invalidRoomError
      }
      //Check if room code field contains special characters
      else if (!/^[a-zA-Z0-9]+$/.test(room)) {
        throw t.invalidRoomError
      }
      //If name is valid, create new user
      const addUserRes = await addUser({
        variables: { name: username },
      }).catch((e) => {
        throw t.genericError
      })

      if (addUserRes.data.addUser.success) {
        userid = addUserRes.data.addUser.id
        Cookies.set('userid', `${userid}`)
      } else {
        throw t.genericError
      }

      //Get List of Users
      const getUserListRes = await getRoomUsers({
        variables: { roomsId: roomCode.value },
      }).catch((e) => {
        throw t.genericError
      })

      let userListID = []
      if (getUserListRes.data.rooms[0]) {
        getUserListRes.data.rooms[0].users.forEach((user) => {
          userListID.push(Number(user.id))
        })
        if (!userListID.includes(userid)) {
          userListID.push(userid)
        }
      } else {
        throw t.roomDoesNotExist
      }

      const updateRoomRes = await updateRoom({
        variables: {
          updateRoomId: roomCode.value,
          updateRoomUsers: userListID,
          isShown: false,
          timer: null,
          cards: [1, 2, 3, 5, 8, 13, 20, 100],
        },
      }).catch((e) => {
        throw t.genericError
      })

      if (!updateRoomRes.data.updateRoom.success) throw t.genericError

      const updateUserRes = await updatedUser({
        variables: {
          userInput: {
            id: userid,
            name: username,
            card: undefined,
            room: roomCode.value,
          },
        },
      }).catch((e) => {
        throw t.genericError
      })

      if (updateUserRes.data.updateUser.success) {
        router
          .push({
            pathname: `/room/${roomCode.value}`,
          })
          .catch((e) => {
            throw t.genericError
          })
      } else {
        throw t.genericError
      }
    } catch (e) {
      setJoinRoomError(e)
    }
  }

  const onCreateHandler = async (e) => {
    //prevent default behaviour of form
    e.preventDefault()
    let username = owner.value,
      userid = Cookies.get('userid')

    try {
      //Check if name is empty
      if (owner.value.trim() === '') {
        throw t.invalidNameError
      }
      //Check if name contains special characters
      else if (!/^([A-Za-z0-9\s\-\'?])+$/.test(username)) {
        throw t.invalidNameError
      }

      //If name is valid, create new room
      const addUserRes = await addUser({
        variables: { name: username },
      }).catch((e) => {
        throw t.genericError
      })

      if (addUserRes.data.addUser.success) {
        userid = addUserRes.data.addUser.id
        Cookies.set('userid', `${userid}`)
      } else {
        throw t.genericError
      }

      const addRoomRes = await addRoom({
        variables: { userid: userid },
      }).catch((e) => {
        throw t.genericError
      })

      if (!addRoomRes.data.addRoom.success) throw t.genericError

      const updateUserRes = await updatedUser({
        variables: {
          userInput: {
            id: userid,
            name: username,
            card: undefined,
            room: addRoomRes.data.addRoom.id,
          },
        },
      }).catch((e) => {
        throw t.genericError
      })

      if (updateUserRes.data.updateUser.success) {
        router
          .push({
            pathname: `/room/${addRoomRes.data.addRoom.id}`,
          })
          .catch((e) => {
            throw t.genericError
          })
      } else {
        throw t.genericError
      }
    } catch (e) {
      setCreateRoomError(e)
    }
  }
  return (
    <>
      {queryErrorCode ? (
        <div className="container mx-auto">
          <ErrorLabel
            errorId="errorCodeMsg"
            message={errorCodeMsg}
            className="pb-4"
          ></ErrorLabel>
        </div>
      ) : undefined}
      <div
        data-testid="homeContent"
        id="homeContent"
        className={`container grid grid-cols-1 gap-y-5 mx-auto sm:flex sm:justify-center sm:gap-x-5 ${
          queryErrorCode ? `sm:mt-6` : ``
        }`}
      >
        <Container className="mx-8 sm:ml-2 sm:mr-2">
          <h2 className="text-opacity-75 text-black font-bold text-2xl">
            {t.createRoomTitle}
          </h2>
          <form
            data-testid="createRoomForm"
            onSubmit={onCreateHandler}
            className="flex flex-col justify-between h-full items-center"
          >
            <div className=" w-full">
              {createRoomError ? (
                <ErrorLabel
                  errorId="createRoomError"
                  message={createRoomError}
                ></ErrorLabel>
              ) : undefined}
              <TextInput
                id="owner"
                label={t.createRoomLabel}
                placeholder={t.createRoomPlaceholder}
                required={t.required}
                errorId="createRoomError"
              />
            </div>

            <button
              type="submit"
              className="w-max font-display text-white bg-[#318000] hover:bg-[#1D4D00] active:bg-[#102900] py-3 px-5 rounded mt-12 focus:drop-shadow focus:ring-2 focus:ring-gray-600 border border-[#458259] text-[22px] leading-8 [text-shadow:1px_2px_0px_#333]"
            >
              {t.createRoomButton}
            </button>
          </form>
        </Container>
        <Container className="mx-8 sm:ml-2 sm:mr-2">
          <h2 className="text-opacity-75 text-black font-bold text-2xl">
            {t.joinRoomTitle}
          </h2>
          <form
            onSubmit={handleJoinSubmit}
            className="flex flex-col justify-between h-full items-center"
          >
            {joinRoomError ? (
              <ErrorLabel
                errorId="joinRoomError"
                message={joinRoomError}
              ></ErrorLabel>
            ) : undefined}
            <TextInput
              id="roomCode"
              label={t.joinRoomNumberLabel}
              placeholder={t.joinRoomNumberPlaceholder}
              required={t.required}
              errorId="joinRoomError"
            />

            <TextInput
              id="newRoomName"
              label={t.joinRoomNameLabel}
              placeholder={t.joinRoomNamePlaceholder}
              required={t.required}
              errorId="joinRoomError"
            />
            <button
              type="submit"
              className="w-max font-display text-white bg-[#318000] hover:bg-[#1D4D00] active:bg-[#102900] py-3 px-5 rounded mt-12 focus:drop-shadow focus:ring-2 focus:ring-gray-600 border border-[#458259] text-[22px] leading-8 [text-shadow:1px_2px_0px_#333]"
            >
              {t.joinRoomButton}
            </button>
          </form>
        </Container>
      </div>
    </>
  )
}
export async function getStaticProps({ locale }) {
  /* istanbul ignore next */
  const langToggleLink = locale === 'en' ? '/fr/home' : '/home'
  /* Place-holder Meta Data Props */
  const meta = {
    data_en: {
      title: 'Scrum Poker - Home',
      desc: 'English',
      author: 'Service Canada',
      keywords: '',
    },
    data_fr: {
      title: 'Scrum Poker - Accueil',
      desc: 'Français',
      author: 'Service Canada',
      keywords: '',
    },
  }
  return {
    props: { locale, langToggleLink, meta },
  }
}
Home.propTypes = {
  /**
   * current locale in the address
   */
  locale: PropTypes.string,
  /*
   * Meta Tags
   */
  meta: PropTypes.object,
}
