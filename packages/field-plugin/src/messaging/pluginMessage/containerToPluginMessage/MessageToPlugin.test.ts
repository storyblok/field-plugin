import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'

const stub: MessageToPlugin<'dummy'> = {
  action: 'dummy',
  uid: '-preview',
}

describe('message from plugin to container', () => {
  describe('the uid property', () => {
    it('is required', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          uid: 'abc',
        }),
      ).toEqual(true)
      expect(
        isMessageToPlugin({
          ...stub,
          uid: undefined,
        }),
      ).toEqual(false)
    })
    it('is a string', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          uid: 'abc',
        }),
      ).toEqual(true)
      expect(
        isMessageToPlugin({
          ...stub,
          uid: undefined,
        }),
      ).toEqual(false)
      expect(
        isMessageToPlugin({
          ...stub,
          uid: 123,
        }),
      ).toEqual(false)
    })
  })
  describe('the action property', () => {
    it('is required', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          action: 'any-string',
        }),
      ).toEqual(true)
      expect(
        isMessageToPlugin({
          ...stub,
          action: undefined,
        }),
      ).toEqual(false)
    })
    it('is a string', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          action: 'any-string',
        }),
      ).toEqual(true)
      expect(
        isMessageToPlugin({
          ...stub,
          action: 123,
        }),
      ).toEqual(false)
      expect(
        isMessageToPlugin({
          ...stub,
          action: undefined,
        }),
      ).toEqual(false)
      expect(
        isMessageToPlugin({
          ...stub,
          action: true,
        }),
      ).toEqual(false)
      expect(
        isMessageToPlugin({
          ...stub,
          action: false,
        }),
      ).toEqual(false)
      expect(
        isMessageToPlugin({
          ...stub,
          action: null,
        }),
      ).toEqual(false)
    })
  })
})
