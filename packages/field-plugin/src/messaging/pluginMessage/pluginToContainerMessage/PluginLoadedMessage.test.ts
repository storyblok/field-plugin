import { isMessageToContainer } from './MessageToContainer'
import {
  isPluginLoadedMessage,
  PluginLoadedMessage,
  pluginLoadedMessage,
} from './PluginLoadedMessage'

const uid = '-preview-abc-123'
const callbackId = 'test-callback-id'
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
    describe('fullHeight', () => {
      it('is optional', () => {
        expect(
          isPluginLoadedMessage({
            ...stub,
            fullHeight: undefined,
          }),
        ).toEqual(true)
      })
      it('is a boolean', () => {
        expect(
          isPluginLoadedMessage({
            ...stub,
            fullHeight: true,
          }),
        ).toEqual(true)
        expect(
          isPluginLoadedMessage({
            ...stub,
            fullHeight: false,
          }),
        ).toEqual(true)
        const { fullHeight: _, ...subWithoutFullHeight } = stub
        expect(isPluginLoadedMessage(subWithoutFullHeight)).toEqual(true)
        expect(
          isPluginLoadedMessage({
            ...stub,
            fullHeight: 'false',
          }),
        ).toEqual(false)
        expect(
          isPluginLoadedMessage({
            ...stub,
            fullHeight: 123,
          }),
        ).toEqual(false)
        expect(
          isPluginLoadedMessage({
            ...stub,
            fullHeight: null,
          }),
        ).toEqual(false)
      })
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(pluginLoadedMessage({ uid, callbackId })).toHaveProperty(
        'uid',
        uid,
      )
    })
    it('sets fullHeight to true', () => {
      expect(pluginLoadedMessage({ uid, callbackId })).toHaveProperty(
        'fullHeight',
        true,
      )
    })
  })
})
