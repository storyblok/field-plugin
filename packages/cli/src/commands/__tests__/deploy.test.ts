import { afterEach, expect, vi } from 'vitest'
import { decidePackageName, deploy } from '../deploy'
import { getPersonalAccessToken } from '../../utils'

vi.mock('../../utils')

vi.mock('../deploy', async () => {
  const actualDeploy = await vi.importActual<typeof import('../deploy')>(
    '../deploy',
  )

  return {
    ...actualDeploy,
    decidePackageName: vi.fn(),
  }
})

describe('deploy', () => {
  afterEach(() => {
    vi.resetAllMocks()
    vi.unstubAllGlobals()
  })

  it('should exit when getPersonalAccessToken returns an error', async () => {
    const exit = vi.fn(() => {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error('Exiting Process Error')
    })
    vi.stubGlobal('process', { exit })

    vi.mocked(getPersonalAccessToken).mockImplementation((params) => {
      return Promise.resolve({ error: true, message: 'Test Error' })
    })

    await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
      'Exiting Process Error',
    )
    expect(exit).toHaveBeenCalledTimes(1)
  })

  it('should exit when decidePackageName returns invalid name', async () => {
    const exit = vi.fn(() => {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error('Exiting Process Error')
    })
    vi.stubGlobal('process', { exit: exit })

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

  it.only('should exit when scope is not provided', async () => {
    const exit = vi.fn(() => {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error('Exiting Process Error')
    })
    vi.stubGlobal('process', { exit: exit })

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
