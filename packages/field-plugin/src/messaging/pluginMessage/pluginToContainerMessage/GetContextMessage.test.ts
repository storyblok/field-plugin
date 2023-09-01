import { isMessageToContainer } from './MessageToContainer'
import {
  GetContextMessage,
  getContextMessage,
  isGetContextMessage,
} from './GetContextMessage'

const uid = '-preview-abc-123'
const callbackId = 'test-callback-id'
const stub: GetContextMessage = {
  action: 'plugin-changed',
  event: 'getContext',
  debounce: false,
  uid,
  callbackId,
}

describe('ValueChangeMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toEqual(true)
    })
    it('requires event to be "getContext"', () => {
      expect(
        isGetContextMessage({
          ...stub,
          event: 'getContext',
        }),
      ).toEqual(true)
      expect(
        isGetContextMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toEqual(false)
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(getContextMessage({ uid, callbackId })).toHaveProperty('uid', uid)
    })
  })
})
