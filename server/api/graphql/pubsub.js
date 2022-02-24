import { PubSub } from 'graphql-subscriptions'

export const pubsub = new PubSub()
export const subscriptions = {
  path: '/subscriptions',
  onConnect: (connectionParams, webSocket, context) => {
    console.log('Client connected')
  },
  onDisconnect: (webSocket, context) => {
    console.log('Client disconnected')
  },
}
