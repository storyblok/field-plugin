import { isMessageToContainer } from './MessageToContainer'
import {
  isPluginLoadedMessage,
  pluginLoadedMessage,
  PluginLoadedMessage,
} from './PluginLoadedMessage'

const uid = '-preview-abc-123'
const stub: PluginLoadedMessage = {
  action: 'plugin-changed',
  event: 'loaded',
  uid,
}

describe('PluginLoadedMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toEqual(true)
    })
    it('requires event to be "loaded"', () => {
      expect(
        isPluginLoadedMessage({
          ...stub,
          event: 'loaded',
        }),
      ).toEqual(true)
      expect(
        isPluginLoadedMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toEqual(false)
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(pluginLoadedMessage(uid)).toHaveProperty('uid', uid)
    })
  })
})
