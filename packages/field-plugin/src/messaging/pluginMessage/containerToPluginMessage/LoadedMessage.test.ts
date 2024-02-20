import { isLoadedMessage, LoadedMessage } from './LoadedMessage'
import { FieldPluginSchema } from './FieldPluginSchema'

const stub: LoadedMessage = {
  action: 'loaded',
  uid: '-preview',
  spaceId: null,
  model: undefined,
  isModalOpen: false,
  token: null,
  storyId: undefined,
  blockId: undefined,
  story: { content: {} },
  language: '',
  interfaceLanguage: 'en',
  schema: { options: [], field_type: 'blah', translatable: false },
  releases: [],
  releaseId: undefined,
}

describe('StateChangedMessage', () => {
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
})
