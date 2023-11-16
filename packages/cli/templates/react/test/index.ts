import {
  isAssetModalChangeMessage,
  isGetContextMessage,
  isHeightChangeMessage,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isValueChangeMessage,
} from '@storyblok/field-plugin'
import { vi } from 'vitest'

export function mockStateMessage(args: any) {
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

export function createMessageToFieldPlugin(data: unknown) {

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


export function createMockContainer() {
  let onMessage

  const sendToFieldPlugin = (data: unknown) => {
    onMessage!(data)
  }

  return {
    setListener: (handleMessage: (data: unknown) => void) => (onMessage = handleMessage),
    onReceive: (data: unknown) => {
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


export const setup = () => {

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
  })

  vi.stubGlobal('location', {
    ...window.location,
    search:
      '?protocol=https%3A&host=plugin-sandbox.storyblok.com&uid=test-uid&preview=1',
  })
}




