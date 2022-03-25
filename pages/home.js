import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'
import Container from '../components/Container'
import TextInput from '../components/TextInput'

import { useMutation } from '@apollo/client'
import ADD_ROOM_QUERY from '../graphql/queries/addRoom.graphql'
import ADD_USER_QUERY from '../graphql/queries/addUser.graphql'
import GET_ROOM_QUERY from '../graphql/queries/isUserInRoom.graphql'
import UPDATE_ROOM_QUERY from '../graphql/queries/updateRoomByID.graphql'

import { useRouter } from 'next/router'
import { ErrorLabel } from '../components/ErrorLabel'
import { useState } from 'react'

import client from '../graphql/client.js'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr

  const [createRoomError, setCreateRoomError] = useState(undefined)
  const [joinRoomError, setJoinRoomError] = useState(undefined)

  const router = useRouter()

  //Load GraphQL Data

  const [addRoom] = useMutation(ADD_ROOM_QUERY)
  const [addUser] = useMutation(ADD_USER_QUERY)
  const [updateRoom] = useMutation(UPDATE_ROOM_QUERY)

  const handleJoinSubmit = (e) => {
    e.preventDefault()
    // Create a User
    addUser({ variables: { name: e.target.newRoomName.value } })
      .then((res) => {
        // User has been created
        // Store cookie with userid as key
        document.cookie = `userid=${res.data.addUser.id}`
        return res.data.addUser.id
      })
      .then((userid) => {
        let roomCode = e.target.roomCode.value
        // Update room with user added
        //Get current usersList from room id
        client
          .query({ query: GET_ROOM_QUERY, variables: { roomsId: roomCode } })
          .then((res) => {
            let userListID = []
            res.data.rooms[0].users.forEach((user) => {
              userListID.push(Number(user.id))
            })
            userListID.push(userid)
            updateRoom({
              variables: {
                updateRoomId: roomCode,
                updateRoomUsers: userListID,
              },
            })
              .then((res) =>
                // Room created, redirecting to that room...
                router
                  .push({
                    pathname: `/room/${roomCode}`,
                  })
                  .catch((e) => {
                    // Room was not joined.
                    console.log(e)
                  })
              )
              .catch((e) => {
                // User was not created.
                console.log(e)
              })
          })
      })
  }

  let onCreateHandler = async (e) => {
    //prevent default behaviour of form
    e.preventDefault()

    let error = undefined,
      username = owner.value,
      userid = document.cookie.split('userid=')[1].substring(0, 5) || undefined
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
      if (!error) {
        const addUserRes = await addUser().catch((e) => {
          throw 'Oops! Something went wrong'
        })

        if (addUserRes.data.addUser.success) {
          userid = addUserRes.data.addUser.id
          document.cookie = `userid=${userid}`
          document.cookie = `ownerid=${userid}`
        } else {
          throw 'Oops! Something went wrong'
        }

        const addRoomRes = await addRoom({
          variables: { userid: userid },
        }).catch((e) => {
          throw 'Oops! Something went wrong'
        })

        if (addRoomRes.data.addRoom.success) {
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
      }
    } catch (e) {
      setCreateRoomError(e)
    }
  }
  return (
    <div
      data-testid="homeContent"
      id="homeContent"
      className="container grid grid-cols-1 gap-y-5 mx-auto sm:flex sm:justify-center sm:gap-x-5"
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
        <h3 className="text-opacity-75 text-black text-xl">{t.joinRoomDesc}</h3>
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
  )
}
export async function getStaticProps({ locale }) {
  /* istanbul ignore next */
  const langToggleLink = locale === 'en' ? '/fr/home' : '/home'
  /* Place-holder Meta Data Props */
  const meta = {
    data_en: {
      title: 'Next Template - Home',
      desc: 'English',
      author: 'Service Canada',
      keywords: '',
    },
    data_fr: {
      title: 'Next Template - Accueil',
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
