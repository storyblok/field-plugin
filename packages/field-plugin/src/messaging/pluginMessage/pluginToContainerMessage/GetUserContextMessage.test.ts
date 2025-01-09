import { isMessageToContainer } from './MessageToContainer'
import {
  type GetUserContextMessage,
  getUserContextMessage,
  isGetUserContextMessage,
} from './GetUserContextMessage'

const uid = '-preview-abc-123'
const callbackId = 'test-callback-id'
const stub: GetUserContextMessage = {
  action: 'plugin-changed',
  event: 'getUserContext',
  uid,
  callbackId,
}

describe('GetUserContextMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toEqual(true)
    })
    it('requires event to be "getUserContext"', () => {
      expect(
        isGetUserContextMessage({
          ...stub,
          event: 'getUserContext',
        }),
      ).toEqual(true)
      expect(
        isGetUserContextMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toEqual(false)
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(getUserContextMessage({ uid, callbackId })).toHaveProperty(
        'uid',
        uid,
      )
    })
  })
})
