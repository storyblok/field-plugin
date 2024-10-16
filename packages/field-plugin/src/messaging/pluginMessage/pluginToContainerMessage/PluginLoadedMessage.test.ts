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
        const { fullHeight: _fullHeight, ...subWithoutFullHeight } = stub
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
    describe('subscribeState', () => {
      it('is optional', () => {
        expect(
          isPluginLoadedMessage({
            ...stub,
            subscribeState: undefined,
          }),
        ).toEqual(true)
      })
      it('is a boolean', () => {
        expect(
          isPluginLoadedMessage({
            ...stub,
            subscribeState: true,
          }),
        ).toEqual(true)
        expect(
          isPluginLoadedMessage({
            ...stub,
            subscribeState: false,
          }),
        ).toEqual(true)
        const { subscribeState: _subscribeState, ...subWithoutSubscribeState } =
          stub
        expect(isPluginLoadedMessage(subWithoutSubscribeState)).toEqual(true)
        expect(
          isPluginLoadedMessage({
            ...stub,
            subscribeState: 'false',
          }),
        ).toEqual(false)
        expect(
          isPluginLoadedMessage({
            ...stub,
            subscribeState: 123,
          }),
        ).toEqual(false)
        expect(
          isPluginLoadedMessage({
            ...stub,
            subscribeState: null,
          }),
        ).toEqual(false)
      })
    })
    describe('enablePortalModal', () => {
      it('is optional', () => {
        expect(
          isPluginLoadedMessage({
            ...stub,
          }),
        ).toEqual(true)
      })
      it('is a boolean', () => {
        expect(
          isPluginLoadedMessage({
            ...stub,
            enablePortalModal: true,
          }),
        ).toEqual(true)
        expect(
          isPluginLoadedMessage({
            ...stub,
            enablePortalModal: false,
          }),
        ).toEqual(true)
        expect(
          isPluginLoadedMessage({
            ...stub,
            enablePortalModal: 'false',
          }),
        ).toEqual(false)
        expect(
          isPluginLoadedMessage({
            ...stub,
            enablePortalModal: 123,
          }),
        ).toEqual(false)
        expect(
          isPluginLoadedMessage({
            ...stub,
            enablePortalModal: null,
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
    it('sets subscribeState to true', () => {
      expect(pluginLoadedMessage({ uid, callbackId })).toHaveProperty(
        'subscribeState',
        true,
      )
    })
    it('does not define enablePortalModal by default', () => {
      expect(pluginLoadedMessage({ uid, callbackId })).not.toHaveProperty(
        'enablePortalModal',
      )
    })
    it('lets you define enablePortalModal', () => {
      expect(
        pluginLoadedMessage({ uid, callbackId, enablePortalModal: true }),
      ).toHaveProperty('enablePortalModal', true)
      expect(
        pluginLoadedMessage({ uid, callbackId, enablePortalModal: false }),
      ).toHaveProperty('enablePortalModal', false)
      expect(
        pluginLoadedMessage({ uid, callbackId, enablePortalModal: undefined }),
      ).toHaveProperty('enablePortalModal', undefined)
    })
  })
})
