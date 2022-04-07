import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import RoomInfo from './RoomInfo'
import en from '../locales/en'

expect.extend(toHaveNoViolations)

const showRoomInfo = {
  id: 'room',
  roomId: '7#&76',
  playerName: 'some name',
  playersOnline: 99,
}

describe('RoomInfo', () => {
  it('renders RoomInfo', () => {
    const primary = render(
      <RoomInfo
        id={showRoomInfo.id}
        roomId={showRoomInfo.roomId}
        playerName={showRoomInfo.playerName}
        playerOnline={showRoomInfo.playersOnline}
        t={en}
      />
    )
    expect(primary).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <RoomInfo
        id={showRoomInfo.id}
        roomId={showRoomInfo.roomId}
        playerName={showRoomInfo.playerName}
        playerOnline={showRoomInfo.playersOnline}
        t={en}
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
