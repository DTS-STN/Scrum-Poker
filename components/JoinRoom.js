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

import { useMutation, useLazyQuery } from '@apollo/client'
import ADD_USER from '../graphql/mutations/addUser.graphql'
import GET_ROOM from '../graphql/queries/getRoom.graphql'
import UPDATE_ROOM from '../graphql/mutations/updateRoom.graphql'
import UPDATE_USER from '../graphql/mutations/updateUser.graphql'

import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useState } from 'react'

export default function JoinRoom(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr
  const router = useRouter()

  //Load GraphQL Data
  const [addUser] = useMutation(ADD_USER)
  const [updatedUser] = useMutation(UPDATE_USER)
  const [updateRoom] = useMutation(UPDATE_ROOM)
  const [getRoomUsers] = useLazyQuery(GET_ROOM)

  // form client side validation rules
  const validationSchema = Yup.object().shape({
    room: Yup.string()
      .required(t.invalidRoomError)
      .matches(/^[a-zA-Z0-9]*$/gm, t.invalidRoomError)
      .max(5, t.max5),
    name: Yup.string()
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

  //************************************* */
  //SUBMIT FORM BUSINESS LOGIC
  //************************************* */
  async function onSubmit(data) {
    let username = data.name,
      userid = Cookies.get('userid'),
      room = data.room

    try {
      //create new user
      const addUserRes = await addUser({
        variables: { name: username },
      }).catch((e) => {
        console.log(e)
        throw t.saveUserFail
      })
      if (addUserRes.data.addUser.success) {
        userid = addUserRes.data.addUser.id
        Cookies.set('userid', `${userid}`)
      } else {
        throw t.saveUserFail
      }

      //Get List of Users
      const getUserListRes = await getRoomUsers({
        variables: { roomsId: room },
      }).catch((e) => {
        console.log(e)
        throw t.noRoomExists
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
        throw t.noRoomExists
      }

      //updating room
      const updateRoomRes = await updateRoom({
        variables: {
          updateRoomId: room,
          updateRoomUsers: userListID,
          isShown: false,
        },
      })
      if (!updateRoomRes.data.updateRoom.success) {
        throw t.saveRoomFail
      }

      //updating user
      const updateUserRes = await updatedUser({
        variables: {
          userInput: {
            id: userid,
            name: username,
            card: undefined,
            room: room,
          },
        },
      }).catch((e) => {
        console.log(e)
        throw t.saveUserFail
      })

      //pushing to room if all went well
      if (updateUserRes.data.updateUser.success) {
        router.push({
          pathname: `/room/${room}`,
        })
      }
      if (!updateUserRes.data.updateUser.success) {
        throw t.saveUserFail
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
  }

  return (
    <form
      id="joinRoom"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full items-center"
    >
      <Container className="mx-8 sm:ml-2 sm:mr-2">
        <h2 className="text-opacity-75 text-black font-bold text-2xl">
          {t.joinRoomTitle}
        </h2>
        {hasError && (
          <div className="container mx-auto">
            <ErrorLabel
              message={msg}
              className="pb-4"
              hidden={false}
              serverError={true}
            ></ErrorLabel>
          </div>
        )}
        <TextInput
          register={register}
          id="room"
          label={t.joinRoomNumberLabel}
          placeholder={t.joinRoomNumberPlaceholder}
          required={t.required}
          errors={errors.room}
        />
        <TextInput
          register={register}
          id="name"
          label={t.joinRoomNameLabel}
          placeholder={t.joinRoomNamePlaceholder}
          required={t.required}
          errors={errors.name}
        />
        <div className="justify-center flex">
          <FormButton text={t.joinRoomButton} />
        </div>
      </Container>
    </form>
  )
}

JoinRoom.propTypes = {
  locale: PropTypes.string,
}
