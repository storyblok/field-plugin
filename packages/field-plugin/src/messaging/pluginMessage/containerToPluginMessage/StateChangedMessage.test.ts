import { isStateMessage, StateChangedMessage } from './StateChangedMessage'
import { FieldPluginSchema } from './FieldPluginSchema'

const stub: StateChangedMessage = {
  action: 'state-changed',
  uid: '-preview',
  spaceId: null,
  userId: undefined,
  model: undefined,
  isModalOpen: false,
  token: null,
  storyId: undefined,
  blockId: undefined,
  story: { content: {} },
  language: '',
  interfaceLanguage: 'en',
  schema: { options: [], field_type: 'blah', translatable: false },
  isAIEnabled: false,
  releases: [],
  releaseId: undefined,
}

describe('StateChangedMessage', () => {
  it('should validate', () => {
    expect(isStateMessage(stub)).toEqual(true)
  })
  describe('The "action" property', () => {
    it('equals "loaded"', () => {
      expect(
        isStateMessage({
          ...stub,
          action: 'anotherString',
        }),
      ).toEqual(false)
    })
  })
  describe('the "uid" property', () => {
    it('is a string', () => {
      expect(
        isStateMessage({
          ...stub,
          uid: 'anything',
        }),
      ).toEqual(true)
    })
    it('is not undefined', () => {
      expect(
        isStateMessage({
          ...stub,
          uid: undefined,
        }),
      ).toEqual(false)
    })
    it('is not null', () => {
      expect(
        isStateMessage({
          ...stub,
          uid: null,
        }),
      ).toEqual(false)
    })
    it('is not a number', () => {
      expect(
        isStateMessage({
          ...stub,
          uid: 123,
        }),
      ).toEqual(false)
    })
  })

  describe('the "language" property', () => {
    it('is a string', () => {
      expect(
        isStateMessage({
          ...stub,
          language: 'anything',
        }),
      ).toEqual(true)
    })
    it('is not undefined', () => {
      expect(
        isStateMessage({
          ...stub,
          language: undefined,
        }),
      ).toEqual(false)
    })
    it('is not null', () => {
      expect(
        isStateMessage({
          ...stub,
          language: null,
        }),
      ).toEqual(false)
    })
    it('is not a number', () => {
      expect(
        isStateMessage({
          ...stub,
          language: 123,
        }),
      ).toEqual(false)
    })
  })
  describe('The "schema" property', () => {
    it('is required', () => {
      expect(
        isStateMessage({
          ...stub,
          schema: undefined,
        }),
      ).toEqual(false)
    })
    it('must be a schema', () => {
      expect(
        isStateMessage({
          ...stub,
          schema: {
            field_type: 'my-field',
            options: [
              {
                name: 'a',
                value: 'ab',
              },
            ],
            translatable: false,
          } as FieldPluginSchema,
        }),
      ).toEqual(true)
    })
  })
  describe('The "userId" property', () => {
    it('is a number', () => {
      expect(
        isStateMessage({
          ...stub,
          userId: 123,
        }),
      ).toEqual(true)
    })
    it('is undefined', () => {
      expect(
        isStateMessage({
          ...stub,
          userId: undefined,
        }),
      ).toEqual(true)
    })
    it('is not null', () => {
      expect(
        isStateMessage({
          ...stub,
          userId: null,
        }),
      ).toEqual(false)
    })
    it('is not a string', () => {
      expect(
        isStateMessage({
          ...stub,
          userId: '123',
        }),
      ).toEqual(false)
    })
  })
  describe('The "isAIEnabled" property', () => {
    it('is a boolean and it is true', () => {
      expect(
        isStateMessage({
          ...stub,
          isAIEnabled: true,
        }),
      ).toEqual(true)
    })
    it('is a boolean and it is false', () => {
      expect(
        isStateMessage({
          ...stub,
          isAIEnabled: false,
        }),
      ).toEqual(true)
    })
    it('is not null', () => {
      expect(
        isStateMessage({
          ...stub,
          isAIEnabled: null,
        }),
      ).toEqual(false)
    })
    it('is not a string', () => {
      expect(
        isStateMessage({
          ...stub,
          isAIEnabled: '123',
        }),
      ).toEqual(false)
    })
  })
})
