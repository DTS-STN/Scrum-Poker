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

import { useMutation } from '@apollo/client'
import ADD_ROOM from '../graphql/mutations/addRoom.graphql'
import ADD_USER from '../graphql/mutations/addUser.graphql'
import UPDATE_USER from '../graphql/mutations/updateUser.graphql'

import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useState } from 'react'

export default function CreateRoom(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr
  const router = useRouter()

  //Load GraphQL Data
  const [addRoom] = useMutation(ADD_ROOM)
  const [addUser] = useMutation(ADD_USER)
  const [updatedUser] = useMutation(UPDATE_USER)

  // form client side validation rules
  const validationSchema = Yup.object().shape({
    owner: Yup.string()
      .required(t.invalidNameError)
      .matches(/^[\w]+([-_\s]{1}[a-z0-9]+)*$/i, t.invalidNameError),
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
    let username = data.owner
    let userid = Cookies.get('userid')
    setHasError(false)

    try {
      //adding new user
      const addUserRes = await addUser({ variables: { name: username } })
      if (addUserRes.data.addUser.success) {
        userid = addUserRes.data.addUser.id
        Cookies.set('userid', `${userid}`)
      } else {
        triggerError(t.saveUserFail)
      }
      //adding room
      const addRoomRes = await addRoom({
        variables: { userid: userid },
      })
      if (!addRoomRes.data.addRoom.success) {
        triggerError(t.saveRoomFail)
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
      if (!updateUserRes.data.updatedUser.success) {
        triggerError(t.saveUserFail)
      }
      //redirecting to room
      if (updateUserRes.data.updateUser.success) {
        router.push({
          pathname: `/room/${addRoomRes.data.addRoom.id}`,
        })
      }
    } catch (e) {
      console.log(e)
      triggerError(t.genericErrorCreate)
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
      id="createRoom"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full items-center"
    >
      <Container className="mx-8 sm:ml-2 sm:mr-2">
        {hasError && (
          <div className="container mx-auto">
            <ErrorLabel
              message={msg}
              className="pb-4"
              hidden={false}
            ></ErrorLabel>
          </div>
        )}
        <h2 className="text-opacity-75 text-black font-bold text-2xl">
          {t.createRoomTitle}
        </h2>
        <TextInput
          register={register}
          id="owner"
          label={t.createRoomTitle}
          placeholder={t.createRoomPlaceholder}
          required={t.required}
          errors={errors.owner}
        />
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
