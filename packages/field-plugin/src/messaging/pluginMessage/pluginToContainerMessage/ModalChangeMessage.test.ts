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
    describe('fullHeight', () => {
      it('is optional', () => {
        expect(
          isModalChangeMessage({
            ...stub,
            fullHeight: undefined,
          }),
        ).toEqual(true)
      })
      it('is a boolean', () => {
        expect(
          isModalChangeMessage({
            ...stub,
            fullHeight: true,
          }),
        ).toEqual(true)
        expect(
          isModalChangeMessage({
            ...stub,
            fullHeight: false,
          }),
        ).toEqual(true)
        const { fullHeight: _, ...subWithoutFullHeight } = stub
        expect(isModalChangeMessage(subWithoutFullHeight)).toEqual(true)
        expect(
          isModalChangeMessage({
            ...stub,
            fullHeight: 'false',
          }),
        ).toEqual(false)
        expect(
          isModalChangeMessage({
            ...stub,
            fullHeight: 123,
          }),
        ).toEqual(false)
        expect(
          isModalChangeMessage({
            ...stub,
            fullHeight: null,
          }),
        ).toEqual(false)
      })
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
    it('sets fullHeight to true', () => {
      expect(modalChangeMessage(uid, true)).toHaveProperty('fullHeight', true)
      expect(modalChangeMessage(uid, false)).toHaveProperty('fullHeight', true)
    })
  })
})
