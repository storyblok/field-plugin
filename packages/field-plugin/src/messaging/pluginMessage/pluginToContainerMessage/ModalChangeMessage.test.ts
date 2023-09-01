import { isMessageToContainer } from './MessageToContainer'
import {
  isModalChangeMessage,
  ModalChangeMessage,
  modalChangeMessage,
} from './ModalChangeMessage'

const uid = '-preview-abc-123'
const callbackId = 'test-callback-id'
const stub: ModalChangeMessage = {
  action: 'plugin-changed',
  event: 'toggleModal',
  uid,
  status: true,
}

describe('ModalChangeMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toEqual(true)
    })
    it('requires event to be "toggleModal"', () => {
      expect(
        isModalChangeMessage({
          ...stub,
          event: 'toggleModal',
        }),
      ).toEqual(true)
      expect(
        isModalChangeMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toEqual(false)
    })
    it('has a status', () => {
      expect(
        isModalChangeMessage({
          ...stub,
          status: true,
        }),
      ).toEqual(true)
      expect(
        isModalChangeMessage({
          ...stub,
          status: undefined,
        }),
      ).toEqual(false)
    })
    test('that the status is a boolean', () => {
      expect(
        isModalChangeMessage({
          ...stub,
          status: true,
        }),
      ).toEqual(true)
      expect(
        isModalChangeMessage({
          ...stub,
          status: false,
        }),
      ).toEqual(true)
      expect(
        isModalChangeMessage({
          ...stub,
          status: 'false',
        }),
      ).toEqual(false)
      expect(
        isModalChangeMessage({
          ...stub,
          status: 123,
        }),
      ).toEqual(false)
      expect(
        isModalChangeMessage({
          ...stub,
          status: null,
        }),
      ).toEqual(false)
      expect(
        isModalChangeMessage({
          ...stub,
          status: undefined,
        }),
      ).toEqual(false)
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(
        modalChangeMessage({ uid, callbackId, status: true }),
      ).toHaveProperty('uid', uid)
    })
    it('includes the modal status', () => {
      expect(
        modalChangeMessage({ uid, callbackId, status: true }),
      ).toHaveProperty('status', true)
      expect(
        modalChangeMessage({ uid, callbackId, status: false }),
      ).toHaveProperty('status', false)
    })
  })
})
