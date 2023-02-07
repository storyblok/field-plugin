import {
  isStateChangedMessage,
  StateChangedMessage,
} from './StateChangedMessage'
import { FieldPluginSchema } from './FieldPluginSchema'

const stub: StateChangedMessage = {
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

describe('StateChangedMessage', () => {
  it('should validate', () => {
    expect(isStateChangedMessage(stub)).toBeTruthy()
  })
  describe('The "action" property', () => {
    it('equals "loaded"', () => {
      expect(
        isStateChangedMessage({
          ...stub,
          action: 'anotherString',
        }),
      ).toBeFalsy()
    })
  })
  describe('the "uid" property', () => {
    it('is a string', () => {
      expect(
        isStateChangedMessage({
          ...stub,
          uid: 'anything',
        }),
      ).toBeTruthy()
    })
    it('is not undefined', () => {
      expect(
        isStateChangedMessage({
          ...stub,
          uid: undefined,
        }),
      ).toBeFalsy()
    })
    it('is not null', () => {
      expect(
        isStateChangedMessage({
          ...stub,
          uid: null,
        }),
      ).toBeFalsy()
    })
    it('is not a number', () => {
      expect(
        isStateChangedMessage({
          ...stub,
          uid: 123,
        }),
      ).toBeFalsy()
    })
  })
  describe('The "schema" property', () => {
    it('is required', () => {
      expect(
        isStateChangedMessage({
          ...stub,
          schema: undefined,
        }),
      ).toBeFalsy()
    })
    it('must be a schema', () => {
      expect(
        isStateChangedMessage({
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
