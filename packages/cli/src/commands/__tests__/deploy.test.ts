import { describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { deploy, DeployArgs } from '../deploy'
import { getPackageName, isOutputValid, selectApiScope } from '../deploy/helper'
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

      await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
      expect(selectApiScope).toHaveBeenCalledTimes(0)
      expect(getPackageName).toHaveBeenCalledTimes(0)
    })

    it('should exit when getPackageName returns error response', async () => {
      getPersonalAccessTokenSuccessMock()
      getPackageJsonNameErrorMock()

      await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      //TODO better check this
      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
      expect(selectApiScope).toHaveBeenCalledTimes(0)
      expect(getPackageName).toHaveBeenCalledOnce()
      expect(isOutputValid).toHaveBeenCalledTimes(0)
    })

    it('should exit when getPackageName returns empty string', async () => {
      getPersonalAccessTokenSuccessMock()
      getPackageJsonNameSuccessEmptyMock()

      await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
      expect(selectApiScope).toHaveBeenCalledTimes(0)
      expect(getPackageName).toHaveBeenCalledOnce()
      expect(isOutputValid).toHaveBeenCalledTimes(0)
    })

    it('should exit when existsSync returns false', async () => {
      getPersonalAccessTokenSuccessMock()
      getPackageJsonNameSuccessMock()

      await expect(() => deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
      expect(selectApiScope).toHaveBeenCalledTimes(0)
      expect(getPackageName).toHaveBeenCalledOnce()
      expect(isOutputValid).toHaveBeenCalledTimes(1)
    })
  })
})

const defaultDeployArgs: DeployArgs = {
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
  vi.mocked(getPersonalAccessToken).mockImplementation((params) => {
    return Promise.resolve({
      error: true,
      message: 'getPersonalAccessToken Error',
    })
  })

const getPackageJsonNameErrorMock = () =>
  vi.mocked(getPackageName).mockImplementation((name) => {
    return Promise.resolve({ error: true })
  })
const getPackageJsonNameSuccessMock = () =>
  vi.mocked(getPackageName).mockImplementation((name) => {
    return Promise.resolve({ error: false, name: 'test name' })
  })
const getPackageJsonNameSuccessEmptyMock = () =>
  vi.mocked(getPackageName).mockImplementation((name) => {
    return Promise.resolve({ error: false, name: '' })
  })
