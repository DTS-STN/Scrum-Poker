import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import en from '../locales/en'
import fr from '../locales/fr'
import Container from '../components/Container'
import TextInput from '../components/TextInput'
import FormButton from './FormButton'

import { useMutation } from '@apollo/client'
import ADD_ROOM from '../graphql/mutations/addRoom.graphql'
import ADD_USER from '../graphql/mutations/addUser.graphql'
import UPDATE_USER from '../graphql/mutations/updateUser.graphql'

import { useRouter } from 'next/router'
import { useState } from 'react'
import Cookies from 'js-cookie'

export default function CreateRoom(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr
  const [createRoomError, setCreateRoomError] = useState(undefined)
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

  //************************************* */
  //SUBMIT FORM BUSINESS LOGIC
  //************************************* */
  async function onSubmit(data) {
    let username = data.owner
    let userid = Cookies.get('userid')

    setCreateRoomError(e)

    try {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full items-center"
    >
      <Container className="mx-8 sm:ml-2 sm:mr-2">
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
