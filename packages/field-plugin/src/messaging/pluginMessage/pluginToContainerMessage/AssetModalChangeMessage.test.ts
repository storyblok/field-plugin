import {
  assetModalChangeMessage,
  AssetModalChangeMessage,
  isAssetModalChangeMessage,
} from './AssetModalChangeMessage'

const uid = '-preview-abc-123'
const field = 'dummy-field'
const stub: AssetModalChangeMessage = {
  action: 'plugin-changed',
  uid,
  event: 'showAssetModal',
  field,
}

describe('AssetModalChangeMessage', () => {
  describe('validator', () => {
    it('should be an event showAssetModal', () => {
      expect(isAssetModalChangeMessage(stub)).toBeTruthy()
      expect(
        isAssetModalChangeMessage({ ...stub, event: 'wrong-event' }),
      ).toBeFalsy()
      expect(
        isAssetModalChangeMessage({ ...stub, event: undefined }),
      ).toBeFalsy()
      expect(isAssetModalChangeMessage({ ...stub, event: null })).toBeFalsy()
    })
    describe('field property', () => {
      it('is optional', () => {
        expect(
          isAssetModalChangeMessage({
            action: 'plugin-changed',
            uid,
            event: 'showAssetModal',
          }),
        ).toBeTruthy()
      })
      it('can be undefined', () => {
        expect(
          isAssetModalChangeMessage({ ...stub, field: undefined }),
        ).toBeTruthy()
      })
      it('is a string', () => {
        expect(
          isAssetModalChangeMessage({ ...stub, field: 'any-string' }),
        ).toBeTruthy()
        expect(isAssetModalChangeMessage({ ...stub, field: 1 })).toBeFalsy()
        expect(isAssetModalChangeMessage({ ...stub, field: null })).toBeFalsy()
      })
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(assetModalChangeMessage(uid, field)).toHaveProperty('uid', uid)
    })
    test('that the field is optional', () => {
      expect(assetModalChangeMessage(uid)).not.toHaveProperty('field', field)
    })
    test('that if set, the field is included', () => {
      expect(assetModalChangeMessage(uid, field)).toHaveProperty('field', field)
    })
  })
})
