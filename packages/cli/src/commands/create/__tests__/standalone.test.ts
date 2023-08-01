import { vi } from 'vitest'
import { createStandalone } from '../standalone'
import { add } from '../../add'
import { initializeNewRepo } from '../../../utils'

vi.mock('../../add')
vi.mock('../../../utils')

describe('standalone', () => {
  it('runs add with correct paramaters', async () => {
    vi.mocked(add).mockImplementation(() => ({ destPath: 'dest-path' }))
    await createStandalone({
      dir: 'my-directory',
      packageManager: 'npm',
      pluginName: 'my-test-plugin',
      template: 'vue3',
    })
    expect(add).toHaveBeenCalledWith({
      dir: 'my-directory',
      name: 'my-test-plugin',
      packageManager: 'npm',
      structure: 'standalone',
      template: 'vue3',
    })

    expect(initializeNewRepo).toHaveBeenCalledWith({
      dir: 'dest-path',
    })
  })
})
