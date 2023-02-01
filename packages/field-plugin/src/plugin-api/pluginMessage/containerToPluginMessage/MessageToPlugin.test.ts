import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'
import { FieldPluginSchema } from './FieldPluginSchema'

const stub: MessageToPlugin = {
  action: 'loaded',
  uid: '-preview',
  spaceId: null,
  model: undefined,
  token: null,
  storyId: undefined,
  blockId: undefined,
  story: undefined,
  language: '',
  schema: { options: [], field_type: 'blah' },
}

describe('MessageToPlugin', () => {
  it('should validate', () => {
    expect(isMessageToPlugin(stub)).toBeTruthy()
  })
  describe('The "action" property', () => {
    it('equals "loaded"', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          action: 'anotherString',
        }),
      ).toBeFalsy()
    })
  })
  describe('the "uid" property', () => {
    it('is a string', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          uid: 'anything',
        }),
      ).toBeTruthy()
    })
    it('is not undefined', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          uid: undefined,
        }),
      ).toBeFalsy()
    })
    it('is not null', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          uid: null,
        }),
      ).toBeFalsy()
    })
    it('is not a number', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          uid: 123,
        }),
      ).toBeFalsy()
    })
  })
  describe('The "schema" property', () => {
    it('is required', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          schema: undefined,
        }),
      ).toBeFalsy()
    })
    it('must be a schema', () => {
      expect(
        isMessageToPlugin({
          ...stub,
          schema: {
            field_type: 'my-field',
            options: [
              {
                name: 'a',
                value: 'ab',
              },
            ],
          } as FieldPluginSchema,
        }),
      ).toBeTruthy()
    })
  })
})
