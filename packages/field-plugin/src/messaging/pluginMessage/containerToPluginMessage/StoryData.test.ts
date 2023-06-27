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
