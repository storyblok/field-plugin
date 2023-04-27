import {
  AssetSelectedMessage,
  isAssetSelectedMessage,
} from './AssetSelectedMessage'

const stub: AssetSelectedMessage = {
  action: 'asset-selected',
  uid: '-preview',
  field: 'dummy-field',
  filename: 'https://somthing.com/myimage.jpg',
}

describe('AssetSelectedMessage', function () {
  it('is a message to plugin', () => {
    expect(isAssetSelectedMessage(stub)).toEqual(true)
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
  describe('the filename property', () => {
    it('is required', () => {
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: 'any-string',
        }),
      ).toEqual(true)
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: undefined,
        }),
      ).toEqual(false)
    })
    it('is a string', () => {
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: 'any-string',
        }),
      ).toEqual(true)
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: 123,
        }),
      ).toEqual(false)
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: null,
        }),
      ).toEqual(false)
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: undefined,
        }),
      ).toEqual(false)
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: [],
        }),
      ).toEqual(false)
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: {},
        }),
      ).toEqual(false)
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: false,
        }),
      ).toEqual(false)
    })
  })
})
