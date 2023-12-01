import {
  isAssetModalChangeMessage,
  isGetContextMessage,
  isHeightChangeMessage,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isValueChangeMessage,
} from '@storyblok/field-plugin'

import { vi } from 'vitest'

const getContainer = (sendToFieldPlugin: (data: unknown) => void) => {
  const schema = {
    field_type: 'test-field-plugin',
    options: [],
  }
  // @ts-ignore `height` is not used anywhere, but we keep it here.
  let height = undefined
  let uid = 'test-uid'
  let model: any = undefined
  let isModalOpen = false
  let blockId = 'test-block-id'
  let language = 'default'
  let storyId = 'test-story-id'
  let spaceId = 'test-space-id'
  let token = 'test-token'
  let story = {
    content: {},
  }

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
    token,
    action,
  })

  return {
    receive: ({
      data,
    }: {
      data: { callbackId: string } & Record<string, any>
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
    // @ts-ignore
    handleEvent({ data })
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
      (data: { callbackId: string } & Record<string, any>, origin: string) => {
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
