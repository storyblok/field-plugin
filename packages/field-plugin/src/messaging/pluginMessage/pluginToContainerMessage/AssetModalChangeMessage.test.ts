import {
  AssetModalChangeMessage,
  assetModalChangeMessage,
  isAssetModalChangeMessage,
} from './AssetModalChangeMessage'

const uid = '-preview-abc-123'
const callbackId = 'test-callback-id'
const stub: AssetModalChangeMessage = {
  action: 'plugin-changed',
  uid,
  event: 'showAssetModal',
  callbackId,
}

describe('AssetModalChangeMessage', () => {
  describe('validator', () => {
    it('should be an event showAssetModal', () => {
      expect(isAssetModalChangeMessage(stub)).toEqual(true)
      expect(isAssetModalChangeMessage({ ...stub, event: 'wrong-event' })).toBe(
        false,
      )
      expect(isAssetModalChangeMessage({ ...stub, event: undefined })).toBe(
        false,
      )
      expect(isAssetModalChangeMessage({ ...stub, event: null })).toEqual(false)
    })
    describe('field property', () => {
      it('is optional', () => {
        expect(
          isAssetModalChangeMessage({
            action: 'plugin-changed',
            uid,
            callbackId,
            event: 'showAssetModal',
          }),
        ).toEqual(true)
      })
      it('can be undefined', () => {
        expect(isAssetModalChangeMessage({ ...stub, field: undefined })).toBe(
          true,
        )
      })
      it('is a string', () => {
        expect(
          isAssetModalChangeMessage({ ...stub, field: 'any-string' }),
        ).toEqual(true)
        expect(isAssetModalChangeMessage({ ...stub, field: 1 })).toEqual(false)
        expect(isAssetModalChangeMessage({ ...stub, field: null })).toEqual(
          false,
        )
      })
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(assetModalChangeMessage({ uid, callbackId })).toHaveProperty(
        'uid',
        uid,
      )
    })
  })
})
