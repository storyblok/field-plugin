import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'
import FieldPlugin from '.'
import { setupFieldPlugin } from '../../../test'

describe('FieldPluginExample', () => {
  test('should render the component', () => {
    const { cleanUp } = setupFieldPlugin()
    render(<FieldPlugin />)
    const headline = screen.getByText('Field Value')
    expect(headline).toBeInTheDocument()
    cleanUp()
  })

  test('should increase the counter', async () => {
    const { cleanUp } = setupFieldPlugin()
    const user = userEvent.setup()
    render(<FieldPlugin />)
    expect(screen.getByTestId('count').textContent).toEqual('0')
    await user.click(screen.getByText('Increment'))
    expect(screen.getByTestId('count').textContent).toEqual('1')
    await user.click(screen.getByText('Increment'))
    expect(screen.getByTestId('count').textContent).toEqual('2')
    cleanUp()
  })
})
