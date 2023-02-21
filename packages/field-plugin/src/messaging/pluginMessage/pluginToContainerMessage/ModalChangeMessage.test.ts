import { isMessageToContainer } from './MessageToContainer'
import {
  isModalChangeMessage,
  modalChangeMessage,
  ModalChangeMessage,
} from './ModalChangeMessage'

const uid = '-preview-abc-123'
const stub: ModalChangeMessage = {
  action: 'plugin-changed',
  event: 'toggleModal',
  uid,
  status: true,
}

describe('ModalChangeMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toBeTruthy()
    })
    it('requires event to be "toggleModal"', () => {
      expect(
        isModalChangeMessage({
          ...stub,
          event: 'toggleModal',
        }),
      ).toBeTruthy()
      expect(
        isModalChangeMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toBeFalsy()
    })
    it('has a status', () => {
      expect(
        isModalChangeMessage({
          ...stub,
          status: true,
        }),
      ).toBeTruthy()
      expect(
        isModalChangeMessage({
          ...stub,
          status: undefined,
        }),
      ).toBeFalsy()
    })
    test('that the status is a boolean', () => {
      expect(
        isModalChangeMessage({
          ...stub,
          status: true,
        }),
      ).toBeTruthy()
      expect(
        isModalChangeMessage({
          ...stub,
          status: false,
        }),
      ).toBeTruthy()
      expect(
        isModalChangeMessage({
          ...stub,
          status: 'false',
        }),
      ).toBeFalsy()
      expect(
        isModalChangeMessage({
          ...stub,
          status: 123,
        }),
      ).toBeFalsy()
      expect(
        isModalChangeMessage({
          ...stub,
          status: null,
        }),
      ).toBeFalsy()
      expect(
        isModalChangeMessage({
          ...stub,
          status: undefined,
        }),
      ).toBeFalsy()
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(modalChangeMessage(uid, true)).toHaveProperty('uid', uid)
    })
    it('includes the modal status', () => {
      expect(modalChangeMessage(uid, true)).toHaveProperty('status', true)
      expect(modalChangeMessage(uid, false)).toHaveProperty('status', false)
    })
  })
})
