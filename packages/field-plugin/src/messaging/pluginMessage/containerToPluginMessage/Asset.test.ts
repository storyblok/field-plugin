import {
  Asset,
  AssetWrapper,
  assetFromAssetSelectedMessage,
  isAsset,
} from './Asset'
import { AssetSelectedMessage } from './AssetSelectedMessage'

export const emptyAsset: Asset = {
  id: 0,
  fieldtype: 'asset',
  name: '',
  filename: '',
  meta_data: {},
  title: '',
  copyright: '',
  focus: '',
  alt: '',
  source: '',
  is_private: false,
}

const stub: AssetWrapper = {
  filename: 'https://somthing.com/myimage.jpg',
  asset: emptyAsset,
}

const assetSelectedMessage: AssetSelectedMessage = {
  uid: '-preview',
  field: 'blah',
  callbackId: 'test-callback-id',
  action: 'asset-selected',
  filename: 'https://somthing.com/myimage.jpg',
  asset: emptyAsset,
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
  })
  describe('validation', () => {
    describe('the filename property', () => {
      it('is required', () => {
        expect(
          isAsset({
            ...stub,
            filename: 'any-string',
          }),
        ).toEqual(true)
        expect(
          isAsset({
            ...stub,
            filename: undefined,
          }),
        ).toEqual(false)
      })
      it('is a string', () => {
        expect(
          isAsset({
            ...stub,
            filename: 'any-string',
          }),
        ).toEqual(true)
        expect(
          isAsset({
            ...stub,
            filename: 123,
          }),
        ).toEqual(false)
        expect(
          isAsset({
            ...stub,
            filename: null,
          }),
        ).toEqual(false)
        expect(
          isAsset({
            ...stub,
            filename: undefined,
          }),
        ).toEqual(false)
        expect(
          isAsset({
            ...stub,
            filename: [],
          }),
        ).toEqual(false)
        expect(
          isAsset({
            ...stub,
            filename: {},
          }),
        ).toEqual(false)
        expect(
          isAsset({
            ...stub,
            filename: false,
          }),
        ).toEqual(false)
      })
    })
  })
})
