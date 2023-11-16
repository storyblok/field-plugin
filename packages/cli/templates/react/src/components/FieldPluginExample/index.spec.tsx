import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import FieldPlugin from '.'
import { setup } from '../../../test'

describe('FieldPluginExample', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('should render the component', async () => {
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
