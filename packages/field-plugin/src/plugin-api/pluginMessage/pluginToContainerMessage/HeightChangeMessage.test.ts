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
      expect(isMessageToContainer(stub)).toBeTruthy()
    })
    it('requires event to be "heightChange"', () => {
      expect(
        isHeightChangeMessage({
          ...stub,
          event: 'heightChange',
        }),
      ).toBeTruthy()
      expect(
        isHeightChangeMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toBeFalsy()
    })
    test('that height is a number', () => {
      expect(isHeightChangeMessage(stub)).toBeTruthy()
      expect(
        isHeightChangeMessage({
          ...stub,
          height: '100vw',
        }),
      ).toBeFalsy()
      expect(
        isHeightChangeMessage({
          ...stub,
          height: undefined,
        }),
      ).toBeFalsy()
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
