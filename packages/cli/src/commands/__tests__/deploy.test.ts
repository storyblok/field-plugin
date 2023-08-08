import { afterEach, expect, vi } from 'vitest'
import { deploy } from '../deploy'
import { decidePackageName, selectApiScope } from '../deploy/helper'
import { getPersonalAccessToken } from '../../utils'

vi.mock('../../utils')
vi.mock('../deploy/helper')

describe('deploy', () => {
  const exit = vi.fn(() => {
    // eslint-disable-next-line functional/no-throw-statement
    throw new Error('Exiting Process Error')
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('process', { exit })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should exit when getPersonalAccessToken returns an error', async () => {
    vi.mocked(getPersonalAccessToken).mockImplementation((params) => {
      return Promise.resolve({ error: true, message: 'Test Error' })
    })

    await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
      'Exiting Process Error',
    )
    expect(exit).toHaveBeenCalledTimes(1)
  })

  it('should exit when decidePackageName returns invalid name', async () => {
    vi.mocked(getPersonalAccessToken).mockImplementation((params) => {
      return Promise.resolve({ error: false, token: 'token' })
    })

    vi.mocked(decidePackageName).mockImplementation((name) => {
      return Promise.resolve({ error: true })
    })

    await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
      'Exiting Process Error',
    )
    expect(exit).toHaveBeenCalledTimes(1)
  })

  it('should exit when scope is not provided', async () => {
    vi.mocked(getPersonalAccessToken).mockImplementation((params) => {
      return Promise.resolve({ error: false, token: 'token' })
    })

    vi.mocked(decidePackageName).mockImplementation((params) => {
      return Promise.resolve({ error: false, packageName: 'Test' })
    })

    await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
      'Exiting Process Error',
    )

    expect(exit).toHaveBeenCalledTimes(1)
    expect(getPersonalAccessToken).toHaveBeenCalledOnce()
    expect(decidePackageName).toHaveBeenCalledOnce()
    expect(selectApiScope).toHaveBeenCalledTimes(0)
  })
})

const defaultDeployArgs = {
  skipPrompts: true,
  dir: '.',
  name: undefined,
  token: undefined,
  output: undefined,
  dotEnvPath: undefined,
  scope: undefined,
}
