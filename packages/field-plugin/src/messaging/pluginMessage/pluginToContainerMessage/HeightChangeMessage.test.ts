import {
  heightChangeMessage,
  HeightChangeMessage,
  isHeightChangeMessage,
} from './HeightChangeMessage'
import { isMessageToContainer } from './MessageToContainer'

const uid = '-preview-abc-123'
const height = 125
const stub: HeightChangeMessage = {
  action: 'plugin-changed',
  event: 'heightChange',
  uid,
  height,
}

describe('isHeightChangeMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toEqual(true)
    })
    it('requires event to be "heightChange"', () => {
      expect(
        isHeightChangeMessage({
          ...stub,
          event: 'heightChange',
        }),
      ).toEqual(true)
      expect(
        isHeightChangeMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toEqual(false)
    })
    describe('height', () => {
      it('is a number', () => {
        expect(
          isHeightChangeMessage({
            ...stub,
            height: 123,
          }),
        ).toEqual(true)
        expect(
          isHeightChangeMessage({
            ...stub,
            height: '100%',
          }),
        ).toEqual(false)
      })
      it('is required', () => {
        expect(
          isHeightChangeMessage({
            ...stub,
            height: undefined,
          }),
        ).toEqual(false)
      })
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(heightChangeMessage(uid, height)).toHaveProperty('uid', uid)
    })
    it('includes the height', () => {
      expect(heightChangeMessage(uid, height)).toHaveProperty('height', height)
    })
  })
})
