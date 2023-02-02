import { isMessageToContainer } from './MessageToContainer'
import {
  isPluginLoadedMessage,
  PluginLoadedMessage,
} from './PluginLoadedMessage'

const stub: PluginLoadedMessage = {
  action: 'plugin-changed',
  event: 'loaded',
  uid: '-prevew',
}

describe('PluginLoadedMessage', () => {
  it('is a MessageToContainer', () => {
    expect(isMessageToContainer(stub)).toBeTruthy()
  })
  it('requires event to be "loaded"', () => {
    expect(
      isPluginLoadedMessage({
        ...stub,
        event: 'loaded',
      }),
    ).toBeTruthy()
    expect(
      isPluginLoadedMessage({
        ...stub,
        event: 'somethingElse',
      }),
    ).toBeFalsy()
  })
})
