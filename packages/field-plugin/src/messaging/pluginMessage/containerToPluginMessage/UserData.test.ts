import { isUserData } from './UserData'

describe('UserData', () => {
  describe('validation', () => {
    it('is an object', () => {
      expect(
        isUserData({ isSpaceAdmin: false, permissions: undefined }),
      ).toEqual(true)
      expect(isUserData([])).toEqual(false)
      expect(isUserData('')).toEqual(false)
      expect(isUserData(1)).toEqual(false)
      expect(isUserData(null)).toEqual(false)
      expect(isUserData(() => undefined)).toEqual(false)
    })
    it('has an isSpaceAdmin property and it is a boolean', () => {
      expect(
        isUserData({ isSpaceAdmin: false, permissions: undefined }),
      ).toEqual(true)
      expect(isUserData({ permissions: undefined })).toEqual(false)
      expect(
        isUserData({ isSpaceAdmin: undefined, permissions: undefined }),
      ).toEqual(false)
    })
    it('has a permissions property and it is an object or undefined', () => {
      expect(
        isUserData({ isSpaceAdmin: false, permissions: undefined }),
      ).toEqual(true)
      expect(isUserData({ isSpaceAdmin: false, permissions: {} })).toEqual(true)
      expect(
        isUserData({ isSpaceAdmin: false, permissions: { key: [] } }),
      ).toEqual(true)
      expect(isUserData({ isSpaceAdmin: false, permissions: [] })).toEqual(
        false,
      )
      expect(isUserData({ isSpaceAdmin: false, permissions: '' })).toEqual(
        false,
      )
      expect(isUserData({ isSpaceAdmin: false, permissions: 1 })).toEqual(false)
      expect(isUserData({ isSpaceAdmin: false, permissions: null })).toEqual(
        false,
      )
      expect(
        isUserData({ isSpaceAdmin: false, permissions: () => undefined }),
      ).toEqual(false)
    })
  })
})
