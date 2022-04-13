import { useState, createContext } from 'react'

export const UserIdContext = createContext()

const UserIdProvider = ({ children }) => {
  const [globalUserId, setGlobalUserId] = useState()

  const contextValues = {
    globalUserId,
    setGlobalUserId,
  }

  return (
    <UserIdContext.Provider value={contextValues}>
      {children}
    </UserIdContext.Provider>
  )
}

export default UserIdProvider
