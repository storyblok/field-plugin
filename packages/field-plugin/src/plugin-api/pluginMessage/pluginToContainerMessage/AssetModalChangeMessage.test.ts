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
    it('should include field that is of type string', () => {
      expect(isAssetModalChangeMessage(stub)).toBeTruthy()
      expect(isAssetModalChangeMessage({ ...stub, field: 1 })).toBeFalsy()
      expect(
        isAssetModalChangeMessage({ ...stub, field: undefined }),
      ).toBeFalsy()
      expect(isAssetModalChangeMessage({ ...stub, field: null })).toBeFalsy()
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(assetModalChangeMessage(uid, field)).toHaveProperty('uid', uid)
    })
    it('includes the field', () => {
      expect(assetModalChangeMessage(uid, field)).toHaveProperty('field', field)
    })
  })
})
