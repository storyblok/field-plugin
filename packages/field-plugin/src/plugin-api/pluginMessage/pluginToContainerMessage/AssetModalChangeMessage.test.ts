import { AssetModalChangeMessage } from './AssetModalChangeMessage'

const stub: AssetModalChangeMessage = {
  action: 'plugin-changed',
  uid: '-preview',
  event: 'showAssetModal',
  field: 'dummy',
}

describe('AssetModalChangeMessage', () => {
  it.todo('is a MessageToContainer')
  describe('the "field" property', () => {
    it.todo('is required')
    it.todo('is a string')
  })
})
