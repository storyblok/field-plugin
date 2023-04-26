import { Asset, assetFromAssetSelectedMessage, isAsset } from './Asset'
import { AssetSelectedMessage } from './AssetSelectedMessage'

const stub: Asset = {
  filename: 'https://somthing.com/myimage.jpg',
}

const assetSelectedMessage: AssetSelectedMessage = {
  uid: '-preview',
  field: 'blah',
  action: 'asset-selected',
  filename: 'https://somthing.com/myimage.jpg',
}

describe('Asset', function () {
  describe('constructor', () => {
    it('strips the uid property', () => {
      expect(
        assetFromAssetSelectedMessage(assetSelectedMessage),
      ).not.toHaveProperty('uid')
    })
    it('strips the action property', () => {
      expect(
        assetFromAssetSelectedMessage(assetSelectedMessage),
      ).not.toHaveProperty('action')
    })
    it('strips the field property', () => {
      expect(
        assetFromAssetSelectedMessage(assetSelectedMessage),
      ).not.toHaveProperty('field')
    })
    it('keeps the filename property', () => {
      expect(
        assetFromAssetSelectedMessage(assetSelectedMessage),
      ).toHaveProperty('filename')
    })
    it('keeps unknown properties', () => {
      expect(
        assetFromAssetSelectedMessage({
          ...assetSelectedMessage,
          unknownProperty: 'any-value',
        }),
      ).toHaveProperty('unknownProperty', 'any-value')
    })
  })
  describe('validation', () => {
    it('allows unknown properties', () => {
      expect(
        isAsset({
          ...stub,
          anUnknownProperty: 'something',
        }),
      ).toBe(true)
    })
    describe('the filename property', () => {
      it('is required', () => {
        expect(
          isAsset({
            ...stub,
            filename: 'any-string',
          }),
        ).toBeTruthy()
        expect(
          isAsset({
            ...stub,
            filename: undefined,
          }),
        ).toBeFalsy()
      })
      it('is a string', () => {
        expect(
          isAsset({
            ...stub,
            filename: 'any-string',
          }),
        ).toBeTruthy()
        expect(
          isAsset({
            ...stub,
            filename: 123,
          }),
        ).toBeFalsy()
        expect(
          isAsset({
            ...stub,
            filename: null,
          }),
        ).toBeFalsy()
        expect(
          isAsset({
            ...stub,
            filename: undefined,
          }),
        ).toBeFalsy()
        expect(
          isAsset({
            ...stub,
            filename: [],
          }),
        ).toBeFalsy()
        expect(
          isAsset({
            ...stub,
            filename: {},
          }),
        ).toBeFalsy()
        expect(
          isAsset({
            ...stub,
            filename: false,
          }),
        ).toBeFalsy()
      })
    })
  })
})
