import {
  FieldPluginSchema,
  isAssetModalChangeMessage,
  isGetContextMessage,
  isGetUserContextMessage,
  isHeightChangeMessage,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isPluginPromptAIMessage,
  isValueChangeMessage,
} from '@storyblok/field-plugin'

import { vi } from 'vitest'

const sandboxOrigin: string = 'https://plugin-sandbox.storyblok.com'

const getContainer = (sendToFieldPlugin: (data: unknown) => void) => {
  const schema: FieldPluginSchema = {
    field_type: 'test-field-plugin',
    options: [],
    translatable: false,
  }
  // `height` is not used anywhere, but we keep it here.
  let height = undefined
  const uid = 'test-uid'
  let model: unknown = undefined
  let isModalOpen = false
  const blockId = 'test-block-id'
  const language = 'default'
  const storyId = 'test-story-id'
  const spaceId = 'test-space-id'
  const userId = 1234
  const token = 'test-token'
  const story = {
    content: {},
  }
  const user = {
    isSpaceAdmin: true,
    permissions: {},
  }
  const isAIEnabled = false

  const stateMessage = ({
    action,
    callbackId,
  }: {
    action: 'loaded' | 'state-changed'
    callbackId: string
  }) => ({
    callbackId: callbackId,
    schema,
    model,
    isModalOpen,
    uid,
    blockId,
    story,
    language,
    storyId,
    spaceId,
    userId,
    isAIEnabled,
    token,
    action,
  })

  return {
    receive: ({
      data,
    }: {
      data: { callbackId: string } & Record<string, unknown>
      origin: string
    }) => {
      if (isPluginLoadedMessage(data)) {
        sendToFieldPlugin(
          stateMessage({
            action: 'loaded',
            callbackId: data.callbackId,
          }),
        )
      } else if (isValueChangeMessage(data)) {
        model = data.model
        sendToFieldPlugin(
          stateMessage({
            action: 'state-changed',
            callbackId: data.callbackId,
          }),
        )
      } else if (isModalChangeMessage(data)) {
        isModalOpen = data.status
        sendToFieldPlugin(
          stateMessage({
            action: 'state-changed',
            callbackId: data.callbackId,
          }),
        )
      } else if (isHeightChangeMessage(data)) {
        height = data.height
        console.log('height is set to', height)
      } else if (isAssetModalChangeMessage(data)) {
        sendToFieldPlugin({
          action: 'asset-selected',
          uid,
          filename: 'https://plugin-sandbox.storyblok.com/icon.svg',
          callbackId: data.callbackId,
        })
      } else if (isGetContextMessage(data)) {
        sendToFieldPlugin({
          action: 'get-context',
          uid,
          callbackId: data.callbackId,
          story,
        })
      } else if (isPluginPromptAIMessage(data)) {
        sendToFieldPlugin({
          action: 'prompt-ai',
          uid,
          callbackId: data.callbackId,
          aiResponse: {
            ok: true,
            answer:
              'Fake AI answer for the prompt: ' + data.promptAIPayload.text,
          },
        })
      } else if (isGetUserContextMessage(data)) {
        sendToFieldPlugin({
          action: 'get-user-context',
          uid,
          callbackId: data.callbackId,
          user,
        })
      } else {
        console.warn(
          `Container received unknown message from plugin: ${JSON.stringify(
            data,
          )}`,
        )
      }
    },
  }
}

export const setupFieldPlugin = () => {
  let handleEvent: (event: MessageEvent<unknown>) => void
  const container = getContainer((data: unknown) => {
    // @ts-expect-error incomplete payload, but works for testing
    handleEvent({
      data,
      origin: sandboxOrigin,
    })
  })
  global.ResizeObserver = class ResizeObserver {
    observe() {
      // do nothing
    }

    unobserve() {
      // do nothing
    }

    disconnect() {
      // do nothing
    }
  }
  vi.stubGlobal('parent', {
    ...global.parent,
    postMessage: vi.mocked(
      (
        data: { callbackId: string } & Record<string, unknown>,
        origin: string,
      ) => {
        container.receive({ data, origin })
      },
    ),
  })
  vi.stubGlobal('location', {
    ...window.location,
    search: `?protocol=https%3A&host=plugin-sandbox.storyblok.com&uid=test-uid&preview=1`,
  })

  const addEventListenerFallback = global.addEventListener
  vi.stubGlobal('addEventListener', (name: string, callback: EventListener) => {
    if (name === 'message') {
      handleEvent = callback
    } else {
      addEventListenerFallback.call(global, name, callback)
    }
  })

  const cleanUp = () => {
    vi.unstubAllGlobals()
  }

  return {
    cleanUp,
  }
}
