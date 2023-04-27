import { isStoryData } from './StoryData'

describe('StoryData', () => {
  describe('validation', () => {
    it('is an object', () => {
      expect(isStoryData({ content: {} })).toEqual(true)
      expect(isStoryData([])).toEqual(false)
      expect(isStoryData('')).toEqual(false)
      expect(isStoryData(1)).toEqual(false)
      expect(isStoryData(undefined)).toEqual(false)
      expect(isStoryData(null)).toEqual(false)
      expect(isStoryData(() => undefined)).toEqual(false)
    })
    describe('the "content" property', () => {
      it('is required', () => {
        expect(isStoryData({ content: {} })).toEqual(true)
        expect(isStoryData({})).toEqual(false)
      })
      it('is an object', () => {
        expect(isStoryData({ content: {} })).toEqual(true)
        expect(isStoryData({ content: [] })).toEqual(false)
        expect(isStoryData({ content: 1 })).toEqual(false)
        expect(isStoryData({ content: '' })).toEqual(false)
        expect(isStoryData({ content: undefined })).toEqual(false)
        expect(isStoryData({ content: null })).toEqual(false)
      })
    })
    describe('the "lang" property', () => {
      it('is optional', () => {
        expect(isStoryData({ content: {} })).toEqual(true)
        expect(isStoryData({ content: {}, lang: 'default' })).toEqual(true)
      })
      it('is is a string', () => {
        expect(isStoryData({ content: {}, lang: 'default' })).toEqual(true)
        expect(isStoryData({ content: {}, lang: 'en' })).toEqual(true)
        expect(isStoryData({ content: {}, lang: 'english' })).toEqual(true)

        expect(isStoryData({ content: {}, lang: 123 })).toEqual(false)
        expect(isStoryData({ content: {}, lang: ['en'] })).toEqual(false)
        expect(isStoryData({ content: {}, lang: { s: 1 } })).toEqual(false)
        expect(isStoryData({ content: {}, lang: null })).toEqual(false)
      })
    })
    it('can have unknown properties', () => {
      expect(
        isStoryData({
          content: {},
          someProps: 'someValue',
        }),
      ).toEqual(true)
    })
    test('that the content have unknown properties', () => {
      expect(
        isStoryData({
          content: {
            someProps: 'someValue',
          },
        }),
      ).toEqual(true)
    })
  })
})
