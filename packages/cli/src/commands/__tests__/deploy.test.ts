import { afterAll, afterEach, beforeAll, expect, vi } from 'vitest'
import { decidePackageName, deploy } from '../deploy'
import { getPersonalAccessToken } from '../../utils'

vi.mock('../../utils')

vi.mock('../deploy', async () => {
  const actualDeploy = await vi.importActual<typeof import('../deploy')>(
    '../deploy',
  )

  const mocks = await vi.importMock<typeof import('../deploy')>('../deploy')

  return {
    ...mocks,
    decidePackageName: vi.fn(),
    deploy: actualDeploy.deploy,
  }
})

describe('deploy', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  afterAll(() => {
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
