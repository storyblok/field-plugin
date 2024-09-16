import {
  AssetSelectedMessage,
  isAssetSelectedMessage,
} from './AssetSelectedMessage'
import { isAsset } from './Asset'

const stub: AssetSelectedMessage = {
  action: 'asset-selected',
  uid: '-preview',
  field: 'dummy-field',
  callbackId: 'test-callback-id',
  filename: 'https://somthing.com/myimage.jpg',
  fieldtype: 'asset',
  name: '',
  meta_data: {},
  title: '',
  copyright: '',
  focus: '',
  alt: '',
  source: '',
  is_private: false,
}

describe('AssetSelectedMessage', function () {
  it('is a message to plugin', () => {
    expect(isAssetSelectedMessage(stub)).toEqual(true)
  })
  it('is an Asset', () => {
    expect(isAsset(stub)).toEqual(true)
  })
  it('allows unknown properties', () => {
    expect(
      isAssetSelectedMessage({
        ...stub,
        anUnknownProperty: 'something',
      }),
    ).toEqual(true)
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
      expect(
        isAssetSelectedMessage({
          action: 'asset-selected',
          uid: '-preview',
          filename: 'https://somthing.com/myimage.jpg',
        }),
      ).toEqual(true)
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
