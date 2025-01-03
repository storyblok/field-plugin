import { isLoadedMessage, LoadedMessage } from './LoadedMessage'
import { FieldPluginSchema } from './FieldPluginSchema'

const stub: LoadedMessage = {
  action: 'loaded',
  uid: '-preview',
  spaceId: null,
  userId: undefined,
  model: undefined,
  isModalOpen: false,
  token: null,
  storyId: undefined,
  blockId: undefined,
  story: { content: {} },
  isAIEnabled: false,
  language: '',
  interfaceLanguage: 'en',
  schema: { options: [], field_type: 'blah', translatable: false },
  releases: [],
  releaseId: undefined,
}

describe('LoadedMessage', () => {
  it('should validate', () => {
    expect(isLoadedMessage(stub)).toEqual(true)
  })
  describe('The "action" property', () => {
    it('equals "loaded"', () => {
      expect(
        isLoadedMessage({
          ...stub,
          action: 'anotherString',
        }),
      ).toEqual(false)
    })
  })
  describe('the "uid" property', () => {
    it('is a string', () => {
      expect(
        isLoadedMessage({
          ...stub,
          uid: 'anything',
        }),
      ).toEqual(true)
    })
    it('is not undefined', () => {
      expect(
        isLoadedMessage({
          ...stub,
          uid: undefined,
        }),
      ).toEqual(false)
    })
    it('is not null', () => {
      expect(
        isLoadedMessage({
          ...stub,
          uid: null,
        }),
      ).toEqual(false)
    })
    it('is not a number', () => {
      expect(
        isLoadedMessage({
          ...stub,
          uid: 123,
        }),
      ).toEqual(false)
    })
  })

  describe('the "language" property', () => {
    it('is a string', () => {
      expect(
        isLoadedMessage({
          ...stub,
          language: 'anything',
        }),
      ).toEqual(true)
    })
    it('is not undefined', () => {
      expect(
        isLoadedMessage({
          ...stub,
          language: undefined,
        }),
      ).toEqual(false)
    })
    it('is not null', () => {
      expect(
        isLoadedMessage({
          ...stub,
          language: null,
        }),
      ).toEqual(false)
    })
    it('is not a number', () => {
      expect(
        isLoadedMessage({
          ...stub,
          language: 123,
        }),
      ).toEqual(false)
    })
  })
  describe('The "schema" property', () => {
    it('is required', () => {
      expect(
        isLoadedMessage({
          ...stub,
          schema: undefined,
        }),
      ).toEqual(false)
    })
    it('must be a schema', () => {
      expect(
        isLoadedMessage({
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
        isLoadedMessage({
          ...stub,
          userId: 123,
        }),
      ).toEqual(true)
    })
    it('is undefined', () => {
      expect(
        isLoadedMessage({
          ...stub,
          userId: undefined,
        }),
      ).toEqual(true)
    })
    it('is not null', () => {
      expect(
        isLoadedMessage({
          ...stub,
          userId: null,
        }),
      ).toEqual(false)
    })
    it('is not a string', () => {
      expect(
        isLoadedMessage({
          ...stub,
          userId: '123',
        }),
      ).toEqual(false)
    })
  })
  describe('The "isAIEnabled" property', () => {
    it('is a boolean and it is true', () => {
      expect(
        isLoadedMessage({
          ...stub,
          isAIEnabled: true,
        }),
      ).toEqual(true)
    })
    it('is a boolean and it is false', () => {
      expect(
        isLoadedMessage({
          ...stub,
          isAIEnabled: false,
        }),
      ).toEqual(true)
    })
    it('is not null', () => {
      expect(
        isLoadedMessage({
          ...stub,
          isAIEnabled: null,
        }),
      ).toEqual(false)
    })
    it('is not a string', () => {
      expect(
        isLoadedMessage({
          ...stub,
          isAIEnabled: '123',
        }),
      ).toEqual(false)
    })
  })
})
