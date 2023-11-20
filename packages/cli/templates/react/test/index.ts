import {
  isAssetModalChangeMessage,
  isGetContextMessage,
  isHeightChangeMessage,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isValueChangeMessage,
} from '@storyblok/field-plugin'
import { vi } from 'vitest'

export const setupFieldPlugin = () => {
  const mockContainer = createMockContainer()

  mockResizeObserver()

  vi.stubGlobal('parent', {
    ...global.parent,
    postMessage: vi.mocked((data: unknown, origin: string) =>
      mockContainer.onReceive({ data, origin })),
  })

  vi.stubGlobal('location', {
    ...window.location,
    search:
      '?protocol=https%3A&host=plugin-sandbox.storyblok.com&uid=test-uid&preview=1',
  })

  const addEventListenerFallback = global.addEventListener
  vi.stubGlobal('addEventListener', (name: string, callback: (data: unknown) => void) => {
    if (name === 'message') {
      mockContainer.setListener(callback)
      return
    }
    addEventListenerFallback.call(global, name, callback)

  })
}

// These testing utility functions will be moved to field-plugin/test package
const mockStateMessage = (args: any) => {
  return {
    callbackId: undefined,
    schema: {
      field_type: 'test-field-plugin',
      options: [],
    },
    uid: 'test-uid',
    model: undefined,
    isModalOpen: false,
    blockId: 'test-block-id',
    story: {
      content: {},
    },
    language: 'default',
    storyId: 'test-story-id',
    spaceId: 'test-space-id',
    token: 'test-token',
    action: undefined,
    ...args,
  }
}

const createMessageToFieldPlugin = (data: unknown) => {
  if (isPluginLoadedMessage(data)) {
    return mockStateMessage({
      action: 'loaded',
      callbackId: data.callbackId,
    })

  }

  if (isValueChangeMessage(data)) {
    return mockStateMessage({
      model: data.model,
      action: 'state-changed',
      callbackId: data.callbackId,
    })

  }

  if (isModalChangeMessage(data)) {
    return mockStateMessage({
      isModalOpen: data.status,
      action: 'state-changed',
      callbackId: data.callbackId,
    })
  }

  if (isHeightChangeMessage(data)) {
    return mockStateMessage({
      action: 'state-changed',
      callbackId: data.callbackId,
    })
  }

  if (isAssetModalChangeMessage(data)) {
    return {
      action: 'asset-selected',
      uid: 'test-uid',
      filename: 'https://...',
      field: '',
      callbackId: data.callbackId,
    }
  }

  if (isGetContextMessage(data)) {
    return {
      action: 'get-context',
      uid: 'test-uid',
      callbackId: data.callbackId,
      story: {
        content: {},
      },
    }
  }

  return undefined
}

function createMockContainer() {
  let onMessage

  const sendToFieldPlugin = (data: unknown) => {
    onMessage!({ data })
  }

  return {
    setListener: (handleMessage: (data: unknown) => void) => (onMessage = handleMessage),
    onReceive: ({ data }: any) => {
      const message = createMessageToFieldPlugin(data)
      if (message) {
        sendToFieldPlugin(message)
        return
      }

      console.warn(
        `Container received unknown message from plugin: ${JSON.stringify(
          data,
        )}`,
      )

    },
  }
}

const mockResizeObserver = () => {
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
}





