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
      ).toBeTruthy()
      expect(
        isMessageToPlugin({
          ...stub,
          uid: undefined,
        }),
      ).toBeFalsy()
    })
    it('is a string', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          uid: 'abc',
        }),
      ).toBeTruthy()
      expect(
        isMessageToPlugin({
          ...stub,
          uid: undefined,
        }),
      ).toBeFalsy()
      expect(
        isMessageToPlugin({
          ...stub,
          uid: 123,
        }),
      ).toBeFalsy()
    })
  })
  describe('the action property', () => {
    it('is required', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          action: 'any-string',
        }),
      ).toBeTruthy()
      expect(
        isMessageToPlugin({
          ...stub,
          action: undefined,
        }),
      ).toBeFalsy()
    })
    it('is a string', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          action: 'any-string',
        }),
      ).toBeTruthy()
      expect(
        isMessageToPlugin({
          ...stub,
          action: 123,
        }),
      ).toBeFalsy()
      expect(
        isMessageToPlugin({
          ...stub,
          action: undefined,
        }),
      ).toBeFalsy()
      expect(
        isMessageToPlugin({
          ...stub,
          action: true,
        }),
      ).toBeFalsy()
      expect(
        isMessageToPlugin({
          ...stub,
          action: false,
        }),
      ).toBeFalsy()
      expect(
        isMessageToPlugin({
          ...stub,
          action: null,
        }),
      ).toBeFalsy()
    })
  })
})
