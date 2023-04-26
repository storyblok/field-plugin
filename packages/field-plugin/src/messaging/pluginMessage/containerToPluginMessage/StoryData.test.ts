import { isStoryData } from './StoryData'

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
    it('requires a content property', () => {
      expect(isStoryData({ content: {} })).toBeTruthy()
      expect(isStoryData({})).toBeFalsy()
    })
    it('requires the content property to be an object', () => {
      expect(isStoryData({ content: {} })).toBeTruthy()
      expect(isStoryData({ content: [] })).toBeFalsy()
      expect(isStoryData({ content: 1 })).toBeFalsy()
      expect(isStoryData({ content: '' })).toBeFalsy()
      expect(isStoryData({ content: undefined })).toBeFalsy()
      expect(isStoryData({ content: null })).toBeFalsy()
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
