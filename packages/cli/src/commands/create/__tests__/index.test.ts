import { vi } from 'vitest'
import { create } from '../'
import {
  isValidPackageManager,
  selectPackageManager,
  selectRepositoryStructure,
  isValidStructure,
} from '../../../utils'

vi.mock('../../../utils')
vi.mock('../monorepo')
vi.mock('../standalone')

describe('create', () => {
  let utils: typeof import('../../../utils')

  beforeAll(async () => {
    utils = await vi.importActual('../../../utils')
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('asks for package manager if not given', async () => {
    vi.mocked(isValidPackageManager).mockImplementation(
      utils.isValidPackageManager,
    )
    // @ts-expect-error testing wrong arguments
    await create({ packageManager: 'npmmmm' })
    expect(selectPackageManager).toHaveBeenCalledTimes(1)
  })

  it('does not ask for package manager if given', async () => {
    vi.mocked(isValidPackageManager).mockImplementation(
      utils.isValidPackageManager,
    )
    // @ts-expect-error testing wrong arguments
    await create({ packageManager: 'yarn' })
    expect(selectPackageManager).toHaveBeenCalledTimes(0)
  })

  it('asks for structure if not given', async () => {
    vi.mocked(isValidStructure).mockImplementation(utils.isValidStructure)
    // @ts-expect-error testing wrong arguments
    await create({ packageManager: 'npm', structure: 'i do not know' })
    expect(selectRepositoryStructure).toHaveBeenCalledTimes(1)
  })

  it('does not ask for structure if given', async () => {
    vi.mocked(isValidStructure).mockImplementation(utils.isValidStructure)
    // @ts-expect-error testing wrong arguments
    await create({ packageManager: 'npm', structure: 'standalone' })
    expect(selectRepositoryStructure).toHaveBeenCalledTimes(0)
  })
})
