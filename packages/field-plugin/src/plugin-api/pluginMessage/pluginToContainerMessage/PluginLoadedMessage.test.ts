import { isMessageToContainer } from './MessageToContainer'
import { PluginLoadedMessage } from './PluginLoadedMessage'

const stub: PluginLoadedMessage = {
  action: 'plugin-changed',
  event: 'loaded',
  uid: '-prevew',
}

describe('PluginLoadedMessage', () => {
  it('is a MessageToContainer', () => {
    expect(isMessageToContainer(stub)).toBeTruthy()
  })
})
