import {
  isAssetModalChangeMessage,
  isGetContextMessage,
  isHeightChangeMessage,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isValueChangeMessage,
  type CreateFieldPlugin,
} from '@storyblok/field-plugin'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'

import FieldPlugin from '.'

function fakeContainer() {
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

  let onMessage

  const stateMessage = ({ action, callbackId }: any) => ({
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

  const sendToFieldPlugin = (data: unknown) => {
    onMessage!(data)
  }

  return {
    setListener: (handleMessage: (data: unknown) => void) => (onMessage = handleMessage),
    onReceive: (data: unknown) => {
      if (isPluginLoadedMessage(data)) {
        sendToFieldPlugin(
          stateMessage({
            action: 'loaded',
            callbackId: data.callbackId,
          }),
        )
        return
      }

      if (isValueChangeMessage(data)) {
        model = data.model
        sendToFieldPlugin(
          stateMessage({
            action: 'state-changed',
            callbackId: data.callbackId,
          }),
        )
        return
      }

      if (isModalChangeMessage(data)) {
        isModalOpen = data.status
        sendToFieldPlugin(
          stateMessage({
            action: 'state-changed',
            callbackId: data.callbackId,
          }),
        )
        return
      }

      if (isHeightChangeMessage(data)) {
        height = data.height
        sendToFieldPlugin(
          stateMessage({
            action: 'state-changed',
            callbackId: data.callbackId,
          }),
        )

        return
      }
      if (isAssetModalChangeMessage(data)) {
        sendToFieldPlugin({
          action: 'asset-selected',
          uid,
          filename: 'https://...',
          field: '',
          callbackId: data.callbackId,
        })

        return
      }
      if (isGetContextMessage(data)) {
        sendToFieldPlugin({
          action: 'get-context',
          uid,
          callbackId: data.callbackId,
          story: {
            content: {},
          },
        })

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

vi.mock('@storyblok/field-plugin', async () => {
  const mod = await vi.importActual<typeof import('@storyblok/field-plugin')>(
    '@storyblok/field-plugin',
  )
  const container = fakeContainer()
  const mockedCreateFieldPlugin: CreateFieldPlugin = ({
                                                        onUpdateState,
                                                        validateContent,
                                                      }) =>
    mod.internalCreateFieldPlugin({
      onUpdateState,
      validateContent,
      postToContainer: (message) => {
        return container.onReceive(message)
      },
      listenToContainer: (handleMessage) => {
        container.setListener((message) => {
          return handleMessage(message)
        })
        // cleanup
        return () => {
        }
      },
    })
  return {
    ...mod,
    createFieldPlugin: mockedCreateFieldPlugin,
  }
})

const setup = () => {
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
