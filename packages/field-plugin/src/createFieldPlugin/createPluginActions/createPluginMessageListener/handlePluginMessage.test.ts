import { handlePluginMessage } from './handlePluginMessage'
import { PluginMessageCallbacks } from './createPluginMessageListener'
import type {
  AssetSelectedMessage,
  ContextRequestMessage,
  UserContextRequestMessage,
  LoadedMessage,
  MessageToPlugin,
  PromptAIResponseMessage,
} from '../../../messaging'
import { emptyAsset } from '../../../messaging/pluginMessage/containerToPluginMessage/Asset.test'

const uid = 'abc123'
const mockCallbacks = (): PluginMessageCallbacks => ({
  onStateChange: vi.fn(),
  onContextRequest: vi.fn(),
  onUserContextRequest: vi.fn(),
  onAssetSelect: vi.fn(),
  onUnknownMessage: vi.fn(),
  onLoaded: vi.fn(),
  onPreviewDimension: vi.fn(),
  onPromptAI: vi.fn(),
})

describe('handlePluginMessage', () => {
  it('ignores non-plugin messages', () => {
    const data = {}
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onLoaded).not.toHaveBeenCalled()
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onUserContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onPromptAI).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
  it('ignores plugin messages that have incorrect uid', () => {
    const data: MessageToPlugin<string> = {
      action: 'some-action',
      uid: 'not-matching-the-plugin-uid',
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onLoaded).not.toHaveBeenCalled()
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onUserContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onPromptAI).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
  it('handles unknown message types', () => {
    const data: MessageToPlugin<string> = {
      action: 'some-action',
      uid,
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onLoaded).not.toHaveBeenCalled()
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onUserContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onPromptAI).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).toHaveBeenCalledWith(data)
  })
  it('handles state change messages', () => {
    const data: LoadedMessage = {
      action: 'loaded',
      uid,
      blockId: '093jd',
      language: '',
      interfaceLanguage: 'en',
      model: 123,
      spaceId: 1234,
      userId: 2345,
      story: { content: {} },
      schema: { options: [], field_type: 'avh', translatable: false },
      storyId: 1344,
      token: 'rfwreff2435wewff43',
      isModalOpen: false,
      isAIEnabled: false,
      releases: [],
      releaseId: undefined,
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onLoaded).toHaveBeenCalledWith(data)
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onUserContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onPromptAI).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
  it('handles context request messages', () => {
    const data: ContextRequestMessage = {
      action: 'get-context',
      uid,
      story: { content: {} },
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onLoaded).not.toHaveBeenCalled()
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).toHaveBeenCalledWith(data)
    expect(callbacks.onUserContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
  it('handles user context request messages', () => {
    const data: UserContextRequestMessage = {
      action: 'get-user-context',
      uid,
      user: { isSpaceAdmin: true, permissions: {} },
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onUserContextRequest).toHaveBeenCalledWith(data)
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onPromptAI).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
  it('handles asset select messages', () => {
    const data: AssetSelectedMessage = {
      action: 'asset-selected',
      uid,
      filename: '/my-file.jpg',
      field: 'callback-uid',
      callbackId: 'test-callback-id',
      asset: emptyAsset,
    }
    const callbacks = mockCallbacks()
    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onLoaded).not.toHaveBeenCalled()
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onUserContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).toHaveBeenCalledWith(data)
    expect(callbacks.onPromptAI).not.toHaveBeenCalled()
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })

  it('handles promptAI messages', () => {
    const data: PromptAIResponseMessage = {
      action: 'prompt-ai',
      uid,
      callbackId: 'test-callback-id',
      aiResponse: {
        ok: true,
        answer: 'Some AI generated text',
      },
    }

    const callbacks = mockCallbacks()

    handlePluginMessage(data, uid, callbacks)
    expect(callbacks.onLoaded).not.toHaveBeenCalled()
    expect(callbacks.onStateChange).not.toHaveBeenCalled()
    expect(callbacks.onContextRequest).not.toHaveBeenCalled()
    expect(callbacks.onAssetSelect).not.toHaveBeenCalled()
    expect(callbacks.onPromptAI).toHaveBeenCalledWith(data)
    expect(callbacks.onUnknownMessage).not.toHaveBeenCalled()
  })
})
