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
import ADD_USER from '../graphql/mutations/addUser.graphql'
import GET_ROOM from '../graphql/queries/getRoom.graphql'
import UPDATE_ROOM from '../graphql/mutations/updateRoom.graphql'
import UPDATE_USER from '../graphql/mutations/updateUser.graphql'

import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

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
      .matches(/^[\w]+([-_\s]{1}[a-z0-9]+)*$/i, t.invalidRoomError),
    name: Yup.string()
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
    let username = data.name,
      userid = Cookies.get('userid'),
      room = data.room

    try {
      //If name is valid, create new user
      const addUserRes = await addUser({ variables: { name: username } })

      if (addUserRes.data.addUser.success) {
        userid = addUserRes.data.addUser.id
        Cookies.set('userid', `${userid}`)
      } else {
        throw t.genericError
      }

      //Get List of Users
      const getUserListRes = await getRoomUsers({
        variables: { roomsId: room },
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
        return {
          redirect: {
            permanent: false,
            destination: '/home?errorCode=308',
          },
        }
      }

      const updateRoomRes = await updateRoom({
        variables: {
          updateRoomId: room,
          updateRoomUsers: userListID,
          isShown: false,
        },
      })

      if (!updateRoomRes.data.updateRoom.success) throw t.genericError

      const updateUserRes = await updatedUser({
        variables: {
          userInput: {
            id: userid,
            name: username,
            card: undefined,
            room: room,
          },
        },
      })
      if (updateUserRes.data.updateUser.success) {
        router.push({
          pathname: `/room/${roomCode.value}`,
        })
      } else {
        throw t.genericError
      }
    } catch (e) {
      console.log(e)
      throw t.genericError
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
