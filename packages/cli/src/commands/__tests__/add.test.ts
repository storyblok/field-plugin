import { runCommand } from '../../utils'
import { vi } from 'vitest'

vi.mock('../../utils', async () => {
  const actualUtils = await vi.importActual<typeof import('../../utils')>(
    '../../utils',
  )

  return {
    ...actualUtils,
    runCommand: vi.fn(),
  }
})

describe('add', () => {
  it('works', () => {
    expect(true).toBe(true)
  })
})
