import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import en from '../locales/en'
import fr from '../locales/fr'
import Container from '../components/Container'
import TextInput from '../components/TextInput'
import FormButton from './FormButton'
import { ErrorLabel } from '../components/ErrorLabel'
import Card from '../components/Card'

import { useMutation } from '@apollo/client'
import ADD_ROOM from '../graphql/mutations/addRoom.graphql'
import ADD_USER from '../graphql/mutations/addUser.graphql'
import UPDATE_USER from '../graphql/mutations/updateUser.graphql'

import { useRouter } from 'next/router'
import { useState, useRef, useReducer } from 'react'
import Cookies from 'js-cookie'
import { cards } from '../utils/cards'

export default function CreateRoom(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr

  //useRef doesn't notify the browser when mutating the current ref, so forceUpdate allows us to trigger a re-render instead of using useState and having a delay
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const cardList = useRef([0, 1, 2, 3, 5, 8, 13, 20, 1001, 1002])

  const router = useRouter()

  //Load GraphQL Data
  const [addRoom] = useMutation(ADD_ROOM)
  const [addUser] = useMutation(ADD_USER)
  const [updatedUser] = useMutation(UPDATE_USER)

  // form client side validation rules
  const validationSchema = Yup.object().shape({
    owner: Yup.string()
      .required(t.invalidNameError)
      .matches(/^([A-Za-z0-9\s\-\'?])+$/, t.invalidNameError)
      .max(20, t.max20),
  })

  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState

  //error handling stuff
  const [msg, setMsg] = useState('')
  const [hasError, setHasError] = useState(false)

  //Card component handler
  const onCardClickHandler = async (e, card) => {
    if (cardList.current.includes(card.value)) {
      let filteredList = cardList.current.filter(
        (cardValue) => cardValue !== card.value
      )
      cardList.current = filteredList
    } else {
      cardList.current.push(card.value)
    }
    forceUpdate()
  }

  //************************************* */
  //SUBMIT FORM BUSINESS LOGIC
  //************************************* */
  async function onSubmit(data) {
    let username = data.owner
    let userid = Cookies.get('userid')
    setHasError(false)

    try {
      //Check if card list is empty
      if (cardList.current.length === 0) {
        throw t.emptyCardList
      }
      //adding new user
      const addUserRes = await addUser({ variables: { name: username } })
      if (addUserRes.data.addUser.success) {
        userid = addUserRes.data.addUser.id
        Cookies.set('userid', `${userid}`)
      } else {
        throw t.saveUserFail
      }
      //adding room
      const addRoomRes = await addRoom({
        variables: { userid: userid },
      })
      if (!addRoomRes.data.addRoom.success) {
        throw t.saveRoomFail
      }
      //updating users
      const updateUserRes = await updatedUser({
        variables: {
          userInput: {
            id: userid,
            name: username,
            card: undefined,
            room: addRoomRes.data.addRoom.id,
          },
        },
      })
      if (!updateUserRes.data.updateUser.success) {
        throw t.saveUserFail
      }
      //redirecting to room
      if (updateUserRes.data.updateUser.success) {
        router.push({
          pathname: `/room/${addRoomRes.data.addRoom.id}`,
        })
      }
    } catch (e) {
      console.log(e)
      triggerError(e)
    }
  }

  //builds our error and pushes home
  function triggerError(msg) {
    setHasError(true)
    setMsg(msg)
    router.push({
      pathname: `/home`,
    })
    return
  }

  return (
    <form
      id="createRoom"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full items-center"
    >
      <Container className="mx-8 sm:ml-2 sm:mr-2">
        <h2 className="text-opacity-75 text-black font-bold text-2xl">
          {t.createRoomTitle}
        </h2>
        {hasError && (
          <div className="container mx-auto">
            <ErrorLabel
              message={msg}
              className="pb-4"
              hidden={false}
            ></ErrorLabel>
          </div>
        )}
        <TextInput
          register={register}
          id="owner"
          label={t.createRoomNameLabel}
          placeholder={t.createRoomPlaceholder}
          required={t.required}
          errors={errors.owner}
        />
        <div className="mt-6 w-full">
          <div className="block rounded-t-lg border-t border-l border-r border-gray-300 px-3 py-2 bg-gray-300">
            {t.selectCards}{' '}
            <span className="text-red-800 font-body" aria-hidden="true">
              {t.required}
            </span>
          </div>
          <ul className="pt-2 grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 rounded-b-lg border-gray-300 border-b border-x">
            {cards.map((card) => {
              return (
                <li className="px-1 pb-1" key={card.id}>
                  <label htmlFor={card.id}>
                    <Card
                      src={card.src}
                      id={card.id}
                      alt={card.alt}
                      onClick={(e) => onCardClickHandler(e, card)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 32 || e.keyCode === 13) {
                          onCardClickHandler(e, card)
                        }
                      }}
                      homePage
                      selected={cardList.current.includes(card.value)}
                    />
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="justify-center flex-auto">
          <FormButton text={t.createRoomButton} />
        </div>
      </Container>
    </form>
  )
}

CreateRoom.propTypes = {
  locale: PropTypes.string,
}
