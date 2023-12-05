import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'
import { setupFieldPlugin } from '@storyblok/field-plugin/test'
import { nextTick } from 'vue'
import FieldPlugin from './index.vue'

describe('FieldPluginExample', async () => {
  test('should render the component', async () => {
    const { cleanUp } = setupFieldPlugin()
    render(FieldPlugin)
    await nextTick()
    const headline = screen.getByText('Field Value')
    expect(headline).toBeInTheDocument()
    cleanUp()
  })

  test('should increase the counter', async () => {
    const { cleanUp } = setupFieldPlugin()
    const user = userEvent.setup()
    render(FieldPlugin)
    await nextTick()
    expect(screen.getByTestId('count').textContent).toEqual('0')
    await user.click(screen.getByText('Increment'))
    expect(screen.getByTestId('count').textContent).toEqual('1')
    await user.click(screen.getByText('Increment'))
    expect(screen.getByTestId('count').textContent).toEqual('2')
    cleanUp()
  })
})
