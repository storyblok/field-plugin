import {
  isAssetModalChangeMessage,
  isGetContextMessage,
  isHeightChangeMessage,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isValueChangeMessage,
} from '@storyblok/field-plugin'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'

import FieldPlugin from '.'

const fakeContainer = (listener) => {
  const schema = {
    field_type: 'test-field-plugin',
    options: [],
  }
  let height = undefined
  let uid = 'test-uid'
  let model = undefined
  let isModalOpen = false
  let blockId = 'test-block-id'
  let language = 'default'
  let storyId = 'test-story-id'
  let spaceId = 'test-space-id'
  let token = 'test-token'

  const stateMessage = ({ action, callbackId }) => ({
    callbackId: callbackId,
    schema,
    model,
    isModalOpen,
    uid,
    blockId,
    story: {
      content: {},
    },
    language,
    storyId,
    spaceId,
    token,
    action,
  })

  return {
    got: ({ data, origin }) => {
      if (isPluginLoadedMessage(data)) {
        listener(
          stateMessage({
            action: 'loaded',
            callbackId: data.callbackId,
          }),
        )
      } else if (isValueChangeMessage(data)) {
        model = data.model
        listener(
          stateMessage({
            action: 'state-changed',
            callbackId: data.callbackId,
          }),
        )
      } else if (isModalChangeMessage(data)) {
        isModalOpen = data.status
        listener(
          stateMessage({
            action: 'state-changed',
            callbackId: data.callbackId,
          }),
        )
      } else if (isHeightChangeMessage(data)) {
        height = data.height
        listener(
          stateMessage({
            action: 'state-changed',
            callbackId: data.callbackId,
          }),
        )
      } else if (isAssetModalChangeMessage(data)) {
        listener({
          action: 'asset-selected',
          uid,
          filename: 'https://...',
          field: '',
          callbackId: data.callbackId,
        })
      } else if (isGetContextMessage(data)) {
        listener({
          action: 'get-context',
          uid,
          callbackId: data.callbackId,
          story: {
            content: {},
          },
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

const setup = () => {
  let messageCallback
  const listener = (data) => {
    messageCallback({ data })
  }
  const container = fakeContainer(listener)
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
    postMessage: vi.mocked((data: unknown, origin: string) => {
      container.got({ data, origin })
    }),
  })
  vi.stubGlobal('location', {
    ...window.location,
    search:
      '?protocol=https%3A&host=plugin-sandbox.storyblok.com&uid=test-uid&preview=1',
  })
  const addEventListenerFallback = global.addEventListener

  vi.stubGlobal('addEventListener', (name: string, callback: EventListener) => {
    if (name === 'message') {
      messageCallback = callback
    }
    addEventListenerFallback.call(global, name, callback)
  })
}

describe('FieldPluginExammple', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('should render the component', () => {
    setup()
    render(<FieldPlugin />)
    const headline = screen.getByText('Field Value')
    expect(headline).toBeInTheDocument()
  })

  test('should increase the counter', async () => {
    setup()
    const user = userEvent.setup()
    render(<FieldPlugin />)
    expect(screen.getByTestId('count').textContent).toEqual('0')
    await user.click(screen.getByText('Increment'))
    expect(screen.getByTestId('count').textContent).toEqual('1')
  })
})
