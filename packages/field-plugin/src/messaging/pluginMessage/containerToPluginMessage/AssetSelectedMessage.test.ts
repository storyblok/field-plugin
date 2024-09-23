import {
  AssetSelectedMessage,
  isAssetSelectedMessage,
} from './AssetSelectedMessage'
import { isAsset } from './Asset'
import { emptyAsset } from './Asset.test'

const stub: AssetSelectedMessage = {
  action: 'asset-selected',
  uid: '-preview',
  field: 'dummy-field',
  callbackId: 'test-callback-id',
  filename: 'https://somthing.com/myimage.jpg',
  asset: emptyAsset,
}

describe('AssetSelectedMessage', function () {
  it('is a message to plugin', () => {
    expect(isAssetSelectedMessage(stub)).toEqual(true)
  })
  it('is an Asset', () => {
    expect(isAsset(stub)).toEqual(true)
  })
  describe('the action property', () => {
    it('equals "asset-selected"', () => {
      expect(
        isAssetSelectedMessage({
          ...stub,
          action: 'asset-selected',
        }),
      ).toEqual(true)
      expect(
        isAssetSelectedMessage({
          ...stub,
          action: 'something-else',
        }),
      ).toEqual(false)
    })
  })
  describe('the field property', () => {
    it('is optional', () => {
      const { field: _field, ...withoutField } = stub
      expect(isAssetSelectedMessage(withoutField)).toEqual(true)
    })
    it('can be undefined', () => {
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: undefined,
        }),
      ).toEqual(true)
    })
    it('is a string', () => {
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: 'any-string',
        }),
      ).toEqual(true)
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: 123,
        }),
      ).toEqual(false)
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: null,
        }),
      ).toEqual(false)
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: [],
        }),
      ).toEqual(false)
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: {},
        }),
      ).toEqual(false)
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: false,
        }),
      ).toEqual(false)
    })
  })
})
