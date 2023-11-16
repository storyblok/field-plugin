import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import {
  type CreateFieldPlugin,
} from '@storyblok/field-plugin'
import FieldPlugin from '.'
import { createMockContainer, setup } from '../../../test'

const mockContainer = createMockContainer()

vi.mock('@storyblok/field-plugin', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@storyblok/field-plugin')>()

  const mockedCreateFieldPlugin: CreateFieldPlugin = ({
                                                        onUpdateState,
                                                        validateContent,
                                                      }) =>
    mod.internalCreateFieldPlugin({
      onUpdateState,
      validateContent,
      postToContainer: (message) => {
        return mockContainer.onReceive(message)
      },
      listenToContainer: (handleMessage) => {
        // This listener is set so that it can be used inside the mockContainer whenever a postToContainer is triggered.
        mockContainer.setListener((message) => {
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

describe('FieldPluginExample', () => {
  beforeEach(() => {
    setup()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('should render the component', async () => {
    render(<FieldPlugin />)
    const headline = screen.getByText('Field Value')
    expect(headline).toBeInTheDocument()
  })

  test('should increase the counter', async () => {
    const user = userEvent.setup()
    render(<FieldPlugin />)
    expect(screen.getByTestId('count').textContent).toEqual('0')
    await user.click(screen.getByText('Increment'))
    expect(screen.getByTestId('count').textContent).toEqual('1')
  })
})
