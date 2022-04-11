import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import en from '../locales/en'
import fr from '../locales/fr'
import Container from '../components/Container'
import TextInput from '../components/TextInput'
import FormButton from './FormButton'

import { useMutation, useLazyQuery } from '@apollo/client'
import ADD_ROOM from '../graphql/mutations/addRoom.graphql'
import ADD_USER from '../graphql/mutations/addUser.graphql'
import GET_ROOM from '../graphql/queries/getRoom.graphql'
import UPDATE_ROOM from '../graphql/mutations/updateRoom.graphql'
import UPDATE_USER from '../graphql/mutations/updateUser.graphql'

import { useRouter } from 'next/router'

import { useState } from 'react'
import Cookies from 'js-cookie'

export default function JoinRoom(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr

  // form client side validation rules
  const validationSchema = Yup.object().shape({
    room: Yup.string()
      .required(t.invalidRoomError)
      .matches(/^[\w]+([-_\s]{1}[a-z0-9]+)*$/i, t.invalidRoomError),
    name: Yup.string()
      .required(t.invalidNameError)
      .matches(/^[\w]+([-_\s]{1}[a-z0-9]+)*$/i, t.invalidNameError),
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState

  function onSubmit(data) {
    // display form data on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4))
    return false
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
