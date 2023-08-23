import { handlePluginMessage } from './handlePluginMessage'
import { PluginMessageCallbacks } from './createPluginMessageListener'
import {
  AssetSelectedMessage,
  ContextRequestMessage,
  MessageToPlugin,
  StateChangedMessage,
} from '../../../messaging'

const uid = 'abc123'
const callbackId = 'test-callback-id'

const mockCallbacks = (): PluginMessageCallbacks => ({
  onStateChange: jest.fn(),
  onContextRequest: jest.fn(),
  onAssetSelect: jest.fn(),
  onUnknownMessage: jest.fn(),
})

describe('handlePluginMessage', () => {
  it('ignores non-plugin messages', () => {
    const data = {}
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
  it('ignores plugin messages that have incorrect uid', () => {
    const data: MessageToPlugin<string> = {
      action: 'some-action',
      uid: 'not-matching-the-plugin-uid',
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
  it('handles unknown message types', () => {
    const data: MessageToPlugin<string> = {
      action: 'some-action',
      uid,
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).toHaveBeenCalledWith(data)
  })
  it('handles state change messages', () => {
    const data: StateChangedMessage = {
      action: 'loaded',
      uid,
      blockId: '093jd',
      language: '',
      model: 123,
      spaceId: 1234,
      story: { content: {} },
      schema: { options: [], field_type: 'avh' },
      storyId: 1344,
      token: 'rfwreff2435wewff43',
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onStateChange).toHaveBeenCalledWith(data)
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
  it('handles context request messages', () => {
    const data: ContextRequestMessage = {
      action: 'get-context',
      uid,
      callbackId,
      story: { content: {} },
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).toHaveBeenCalledWith(data)
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
  it('handles asset select messages', () => {
    const data: AssetSelectedMessage = {
      action: 'asset-selected',
      uid,
      filename: '/my-file.jpg',
      field: 'callback-uid',
      callbackId,
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).toHaveBeenCalledWith(data)
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
})
