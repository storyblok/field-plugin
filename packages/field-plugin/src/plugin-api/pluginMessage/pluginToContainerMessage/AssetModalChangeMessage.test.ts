import {
  AssetModalChangeMessage,
  isAssetModalChangeMessage,
} from './AssetModalChangeMessage'

const stub: AssetModalChangeMessage = {
  action: 'plugin-changed',
  uid: '-preview',
  event: 'showAssetModal',
  field: 'dummy',
}

describe('AssetModalChangeMessage', () => {
  it('should be an event showAssetModal', () => {
    expect(isAssetModalChangeMessage(stub)).toBeTruthy()
    expect(
      isAssetModalChangeMessage({ ...stub, event: 'wrong-event' }),
    ).toBeFalsy()
    expect(isAssetModalChangeMessage({ ...stub, event: undefined })).toBeFalsy()
    expect(isAssetModalChangeMessage({ ...stub, event: null })).toBeFalsy()
  })
  it('should include field that is of type string', () => {
    expect(isAssetModalChangeMessage(stub)).toBeTruthy()
    expect(isAssetModalChangeMessage({ ...stub, field: 1 })).toBeFalsy()
    expect(isAssetModalChangeMessage({ ...stub, field: undefined })).toBeFalsy()
    expect(isAssetModalChangeMessage({ ...stub, field: null })).toBeFalsy()
  })
})
