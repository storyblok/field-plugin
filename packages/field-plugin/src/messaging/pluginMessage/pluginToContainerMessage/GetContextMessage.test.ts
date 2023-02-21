import { isMessageToContainer } from './MessageToContainer'
import {
  getContextMessage,
  GetContextMessage,
  isGetContextMessage,
} from './GetContextMessage'

const uid = '-preview-abc-123'
const stub: GetContextMessage = {
  action: 'plugin-changed',
  event: 'getContext',
  uid,
}

describe('ValueChangeMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toBeTruthy()
    })
    it('requires event to be "getContext"', () => {
      expect(
        isGetContextMessage({
          ...stub,
          event: 'getContext',
        }),
      ).toBeTruthy()
      expect(
        isGetContextMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toBeFalsy()
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(getContextMessage(uid)).toHaveProperty('uid', uid)
    })
  })
})
