import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'
import Container from '../components/Container'
import TextInput from '../components/TextInput'

import { useMutation } from '@apollo/client'
import ADD_ROOM_QUERY from '../graphql/queries/addRoom.graphql'
import ADD_USER_QUERY from '../graphql/queries/addUser.graphql'
import { useRouter } from 'next/router'
import { ErrorLabel } from '../components/ErrorLabel'
import { useState } from 'react'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr
  const [isValid, setValid] = useState('')

  const router = useRouter()

  //Load GraphQL Data

  const [addRoom] = useMutation(ADD_ROOM_QUERY)
  const [addUser] = useMutation(ADD_USER_QUERY)

  const handleJoinSubmit = (e) => {
    e.preventDefault()
  }

  let onCreateHandler = (e) => {
    //prevent default behaviour of form
    e.preventDefault()

    let valid = true

    //Check if name is empty
    if (owner.value.trim() === '') {
      valid = false
    }
    //Check if name contains special characters
    else if (!/^[a-zA-Z0-9]+$/.test(owner.value)) {
      valid = false
    } else {
      valid = true
    }

    //If name is valid, create new room
    if (valid) {
      addUser({ variables: { name: e.target.owner.value } })
        .then((res) => {
          //create cookie with res.data.addUser.id
          return res.data.addUser.id
        })
        .then((userid) => {
          console.log(userid)
          addRoom({ variables: { userid: userid } })
            .then((res) =>
              router
                .push({
                  pathname: `/room/${res.data.addRoom.id}`,
                })
                .catch((e) => {
                  console.log(e)
                  setValid(false)
                })
            )
            .catch((e) => {
              console.log(e)
              setValid(false)
            })
        })
    }
    setValid(valid)
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
          {isValid === false ? (
            <ErrorLabel message={t.invalidNameError}></ErrorLabel>
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
