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
    expect(isAssetSelectedMessage(stub)).toBeTruthy()
  })
  describe('the action property', () => {
    it('equals "asset-selected"', () => {
      expect(
        isAssetSelectedMessage({
          ...stub,
          action: 'asset-selected',
        }),
      ).toBeTruthy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          action: 'something-else',
        }),
      ).toBeFalsy()
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
      ).toBeTruthy()
    })
    it('can be undefined', () => {
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: undefined,
        }),
      ).toBeTruthy()
    })
    it('is a string', () => {
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: 'any-string',
        }),
      ).toBeTruthy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: 123,
        }),
      ).toBeFalsy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: null,
        }),
      ).toBeFalsy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: [],
        }),
      ).toBeFalsy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: {},
        }),
      ).toBeFalsy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          field: false,
        }),
      ).toBeFalsy()
    })
  })
  describe('the filename property', () => {
    it('is required', () => {
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: 'any-string',
        }),
      ).toBeTruthy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: undefined,
        }),
      ).toBeFalsy()
    })
    it('is a string', () => {
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: 'any-string',
        }),
      ).toBeTruthy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: 123,
        }),
      ).toBeFalsy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: null,
        }),
      ).toBeFalsy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: undefined,
        }),
      ).toBeFalsy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: [],
        }),
      ).toBeFalsy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: {},
        }),
      ).toBeFalsy()
      expect(
        isAssetSelectedMessage({
          ...stub,
          filename: false,
        }),
      ).toBeFalsy()
    })
  })
})
