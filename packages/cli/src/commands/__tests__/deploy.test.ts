import { describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { deploy } from '../deploy'
import { getPackageName, selectApiScope } from '../deploy/helper'
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

  describe('skipping prompts', () => {
    it('should exit if scope is not provided', async () => {
      await expect(() =>
        deploy({ ...defaultDeployArgs, scope: undefined }),
      ).rejects.toThrowError('Exiting Process Error')

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledTimes(0)
    })

    it('should exit when getPersonalAccessToken returns an error', async () => {
      getPersonalAccessTokenErrorMock()
      getPackageJsonNameSuccessMock()

      await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
      expect(getPackageName).toHaveBeenCalledTimes(1)
      expect(selectApiScope).toHaveBeenCalledTimes(0)
    })

    it('should exit when selectApiScope returns invalid scope', async () => {
      getPersonalAccessTokenSuccessMock()
      getPackageJsonNameSuccessMock()

      await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
    })

    it.skip('should exit when scope is not provided', async () => {
      getPersonalAccessTokenSuccessMock()
      getPackageJsonNameSuccessMock()

      await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
      expect(getPackageName).toHaveBeenCalledOnce()
      expect(selectApiScope).toHaveBeenCalledTimes(0)
    })

    it.skip('should exit when existsSync returns false', async () => {
      getPersonalAccessTokenSuccessMock()

      await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      expect(selectApiScope).not.toHaveBeenCalled()
      expect(exit).toHaveBeenCalledTimes(1)
    })
  })
})

const defaultDeployArgs = {
  skipPrompts: true,
  dir: '.',
  name: undefined,
  token: undefined,
  output: undefined,
  dotEnvPath: undefined,
  scope: 'my-plugins',
}

const getPersonalAccessTokenSuccessMock = () =>
  vi.mocked(getPersonalAccessToken).mockImplementation((params) => {
    return Promise.resolve({ error: false, token: 'token' })
  })
const getPersonalAccessTokenErrorMock = () =>
  vi.mocked(getPersonalAccessToken).mockImplementation(() => {
    return Promise.resolve({ error: false, token: 'test token' })
  })

const getPackageJsonNameSuccessMock = () =>
  vi.mocked(getPackageName).mockImplementation((name) => {
    return Promise.resolve({ error: false, name: 'test name' })
  })

const selectApiScopeErrorMock = () =>
  vi.mocked(selectApiScope).mockImplementation(() => {
    return Promise.resolve(undefined)
  })
