import { isStoryData, StoryData } from './StoryData'

describe('StoryData', () => {
  describe('validation', () => {
    it('is an object', () => {
      expect(isStoryData({ content: {} })).toBeTruthy()
      expect(isStoryData([])).toBeFalsy()
      expect(isStoryData('')).toBeFalsy()
      expect(isStoryData(1)).toBeFalsy()
      expect(isStoryData(undefined)).toBeFalsy()
      expect(isStoryData(null)).toBeFalsy()
      expect(isStoryData(() => undefined)).toBeFalsy()
    })
    describe('the "content" property', () => {
      it('is required', () => {
        expect(isStoryData({ content: {} })).toBeTruthy()
        expect(isStoryData({})).toBeFalsy()
      })
      it('is an object', () => {
        expect(isStoryData({ content: {} })).toBeTruthy()
        expect(isStoryData({ content: [] })).toBeFalsy()
        expect(isStoryData({ content: 1 })).toBeFalsy()
        expect(isStoryData({ content: '' })).toBeFalsy()
        expect(isStoryData({ content: undefined })).toBeFalsy()
        expect(isStoryData({ content: null })).toBeFalsy()
      })
    })
    describe('the "lang" property', () => {
      it('is optional', () => {
        expect(isStoryData({ content: {} })).toBeTruthy()
        expect(isStoryData({ content: {}, lang: 'default' })).toBeTruthy()
      })
      it('is is a string', () => {
        expect(isStoryData({ content: {}, lang: 'default' })).toBeTruthy()
        expect(isStoryData({ content: {}, lang: 'en' })).toBeTruthy()
        expect(isStoryData({ content: {}, lang: 'english' })).toBeTruthy()

        expect(isStoryData({ content: {}, lang: 123 })).toBeFalsy()
        expect(isStoryData({ content: {}, lang: ['en'] })).toBeFalsy()
        expect(isStoryData({ content: {}, lang: { s: 1 } })).toBeFalsy()
        expect(isStoryData({ content: {}, lang: null })).toBeFalsy()
      })
    })
    it('can have unknown properties', () => {
      expect(
        isStoryData({
          content: {},
          someProps: 'someValue',
        }),
      ).toBeTruthy()
    })
    test('that the content have unknown properties', () => {
      expect(
        isStoryData({
          content: {
            someProps: 'someValue',
          },
        }),
      ).toBeTruthy()
    })
  })
})
