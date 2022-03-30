import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'
import Container from '../components/Container'
import TextInput from '../components/TextInput'

import { useMutation, useLazyQuery } from '@apollo/client'
import ADD_ROOM_QUERY from '../graphql/queries/addRoom.graphql'
import ADD_USER_QUERY from '../graphql/queries/addUser.graphql'
import GET_ROOM_QUERY from '../graphql/queries/isUserInRoom.graphql'
import UPDATE_ROOM_QUERY from '../graphql/queries/updateRoomByID.graphql'
import UPDATE_USER from '../graphql/mutations/updateUser.graphql'

import { useRouter } from 'next/router'
import { ErrorLabel } from '../components/ErrorLabel'
import { useState } from 'react'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr

  const [createRoomError, setCreateRoomError] = useState(undefined)
  const [joinRoomError, setJoinRoomError] = useState(undefined)

  const router = useRouter()

  //Load GraphQL Data

  const [addRoom] = useMutation(ADD_ROOM_QUERY)
  const [addUser] = useMutation(ADD_USER_QUERY)
  const [updatedUser] = useMutation(UPDATE_USER)
  const [updateRoom] = useMutation(UPDATE_ROOM_QUERY)
  const [getRoomUsers] = useLazyQuery(GET_ROOM_QUERY)

  const handleJoinSubmit = async (e) => {
    //prevent default behaviour of form
    e.preventDefault()

    let username = newRoomName.value,
      userid = document.cookie.split('userid=')[1]?.substring(0, 5) || undefined

    try {
      //Check if name is empty
      if (newRoomName.value.trim() === '') {
        throw t.invalidNameError
      }
      //Check if name contains special characters
      else if (!/^[a-zA-Z0-9]+$/.test(username)) {
        throw t.invalidNameError
      }

      //If name is valid, create new user
      const addUserRes = await addUser({
        variables: { name: username },
      }).catch((e) => {
        throw 'Oops! Something went wrong'
      })

      if (addUserRes.data.addUser.success) {
        userid = addUserRes.data.addUser.id
        document.cookie = `userid=${userid}`
      } else {
        throw 'Oops! Something went wrong'
      }

      //Get List of Users
      const getUserListRes = await getRoomUsers({
        variables: { roomsId: roomCode.value },
      }).catch((e) => {
        throw 'Oops! Something went wrong'
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
        throw 'Oops! Something went wrong'
      }

      const updateRoomRes = await updateRoom({
        variables: {
          updateRoomId: roomCode.value,
          updateRoomUsers: userListID,
          isShown: false,
        },
      }).catch((e) => {
        throw 'Oops! Something went wrong'
      })

      if (!updateRoomRes.data.updateRoom.success)
        throw 'Oops! Something went wrong'

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
        throw 'Oops! Something went wrong'
      })

      if (updateUserRes.data.updateUser.success) {
        router
          .push({
            pathname: `/room/${roomCode.value}`,
          })
          .catch((e) => {
            throw 'Oops! Something went wrong'
          })
      } else {
        throw 'Oops! Something went wrong'
      }
    } catch (e) {
      setJoinRoomError(e)
    }
  }

  const onCreateHandler = async (e) => {
    //prevent default behaviour of form
    e.preventDefault()

    let username = owner.value,
      userid = document.cookie.split('userid=')[1]?.substring(0, 5) || undefined

    try {
      //Check if name is empty
      if (owner.value.trim() === '') {
        throw t.invalidNameError
      }
      //Check if name contains special characters
      else if (!/^[a-zA-Z0-9]+$/.test(username)) {
        throw t.invalidNameError
      }

      //If name is valid, create new room
      const addUserRes = await addUser({
        variables: { name: username },
      }).catch((e) => {
        throw 'Oops! Something went wrong'
      })

      if (addUserRes.data.addUser.success) {
        userid = addUserRes.data.addUser.id
        document.cookie = `userid=${userid}`
      } else {
        throw 'Oops! Something went wrong'
      }

      const addRoomRes = await addRoom({
        variables: { userid: userid },
      }).catch((e) => {
        throw 'Oops! Something went wrong'
      })

      if (!addRoomRes.data.addRoom.success) throw 'Oops! Something went wrong'

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
        throw 'Oops! Something went wrong'
      })

      if (updateUserRes.data.updateUser.success) {
        router
          .push({
            pathname: `/room/${addRoomRes.data.addRoom.id}`,
          })
          .catch((e) => {
            throw 'Oops! Something went wrong'
          })
      } else {
        throw 'Oops! Something went wrong'
      }
    } catch (e) {
      setCreateRoomError(e)
    }
  }
  return (
    <>
      {router.query.error ? (
        <ErrorLabel message={router.query.error}></ErrorLabel>
      ) : undefined}
      <div
        data-testid="homeContent"
        id="homeContent"
        className={`container grid grid-cols-1 gap-y-5 mx-auto sm:flex sm:justify-center sm:gap-x-5  ${
          router.query.error ? `sm:mt-6` : ``
        }`}
      >
        <Container style="text-center p-4 flex flex-col drop-shadow md:w-96">
          <h2 className="text-opacity-75 text-black font-bold text-2xl">
            {t.createRoomTitle}
          </h2>
          <h3 className="text-opacity-75 text-black text-xl">
            {t.createRoomDesc}
          </h3>
          <form
            data-testid="createRoomForm"
            onSubmit={onCreateHandler}
            className="flex flex-col justify-between h-full items-center"
          >
            {createRoomError ? (
              <ErrorLabel message={createRoomError}></ErrorLabel>
            ) : undefined}
            <TextInput
              id="owner"
              label={t.createRoomLabel}
              placeholder={t.createRoomPlaceholder}
            />
            <button
              type="submit"
              className="w-max font-display text-white bg-[#318000] hover:bg-[#1D4D00] active:bg-[#102900] py-3 px-5 rounded mt-12 focus:drop-shadow focus:ring-2 focus:ring-gray-600 border border-[#458259] text-[22px] leading-8 [text-shadow:1px_2px_0px_#333]"
            >
              {t.createRoomButton}
            </button>
          </form>
        </Container>
        <Container style="text-center p-4 flex flex-col drop-shadow md:w-96">
          <h2 className="text-opacity-75 text-black font-bold text-2xl">
            {t.joinRoomTitle}
          </h2>
          <h3 className="text-opacity-75 text-black text-xl">
            {t.joinRoomDesc}
          </h3>
          <form
            onSubmit={handleJoinSubmit}
            className="flex flex-col justify-between h-full items-center"
          >
            {joinRoomError ? (
              <ErrorLabel message={joinRoomError}></ErrorLabel>
            ) : undefined}
            <TextInput
              id="roomCode"
              label={t.joinRoomNumberLabel}
              placeholder={t.joinRoomNumberPlaceholder}
            />
            <TextInput
              id="newRoomName"
              label={t.joinRoomNameLabel}
              placeholder={t.joinRoomNamePlaceholder}
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
