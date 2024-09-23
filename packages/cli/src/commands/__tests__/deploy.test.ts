import { describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { deploy, DeployArgs } from '../deploy'
import {
  getPackageName,
  isOutputValid,
  selectApiScope,
  upsertFieldPlugin,
} from '../deploy/helper'
import { getPersonalAccessToken } from '../../utils'
import { existsSync, readFileSync } from 'fs'

vi.mock('../../utils')
vi.mock('../deploy/helper')
vi.mock('fs')

describe('deploy', () => {
  const exit = vi.fn(() => {
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
      await expect(
        deploy({ ...defaultDeployArgs, scope: undefined }),
      ).rejects.toThrowError('Exiting Process Error')

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledTimes(0)
    })

    it('should exit when getPersonalAccessToken returns an error', async () => {
      mockPersonalAccessTokenError()

      await expect(deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
      expect(selectApiScope).toHaveBeenCalledTimes(0)
      expect(getPackageName).toHaveBeenCalledTimes(0)
    })

    it('should exit when getPackageName returns error response', async () => {
      mockPersonalAccessTokenSuccess()
      mockPackageJsonNameError()

      await expect(deploy(defaultDeployArgs)).rejects.toThrowError(
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
      mockPersonalAccessTokenSuccess()
      mockPackageJsonNameSuccessEmpty()

      await expect(deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
      expect(selectApiScope).toHaveBeenCalledTimes(0)
      expect(getPackageName).toHaveBeenCalledOnce()
      expect(isOutputValid).toHaveBeenCalledTimes(0)
    })

    it('should exit when the outputPath does not exist', async () => {
      mockPersonalAccessTokenSuccess()
      mockPackageJsonNameSuccess()

      await expect(deploy(defaultDeployArgs)).rejects.toThrowError(
        'Exiting Process Error',
      )

      expect(exit).toHaveBeenCalledTimes(1)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
      expect(selectApiScope).toHaveBeenCalledTimes(0)
      expect(getPackageName).toHaveBeenCalledOnce()
      expect(isOutputValid).toHaveBeenCalledTimes(1)
    })

    it('should resolve without throwing errors', async () => {
      mockPersonalAccessTokenSuccess()
      mockPackageJsonNameSuccess()
      mockExistsSyncSuccess()
      mockReadFileSyncSuccess()
      mockUpsertFieldPluginSuccess()

      await expect(deploy(defaultDeployArgs)).resolves.toEqual(undefined)

      expect(exit).toHaveBeenCalledTimes(0)
      expect(getPersonalAccessToken).toHaveBeenCalledOnce()
      expect(selectApiScope).toHaveBeenCalledTimes(0)
      expect(getPackageName).toHaveBeenCalledOnce()
      expect(isOutputValid).toHaveBeenCalledOnce()
      expect(readFileSync).toHaveBeenCalledOnce()
      expect(upsertFieldPlugin).toHaveBeenCalledOnce()
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

const mockPersonalAccessTokenSuccess = () =>
  vi.mocked(getPersonalAccessToken).mockImplementation(() => {
    return Promise.resolve({ error: false, token: 'token' })
  })
const mockPersonalAccessTokenError = () =>
  vi.mocked(getPersonalAccessToken).mockImplementation(() => {
    return Promise.resolve({
      error: true,
      message: 'getPersonalAccessToken Error',
    })
  })

const mockPackageJsonNameError = () =>
  vi.mocked(getPackageName).mockImplementation(() => {
    return Promise.resolve({ error: true })
  })
const mockPackageJsonNameSuccess = () =>
  vi.mocked(getPackageName).mockImplementation(() => {
    return Promise.resolve({ error: false, name: 'test name' })
  })
const mockPackageJsonNameSuccessEmpty = () =>
  vi.mocked(upsertFieldPlugin).mockImplementation(() => {
    return Promise.resolve({ id: 1 })
  })

const mockUpsertFieldPluginSuccess = () =>
  vi.mocked(upsertFieldPlugin).mockImplementation(() => {
    return Promise.resolve({ id: 1 })
  })

const mockExistsSyncSuccess = () =>
  vi.mocked(existsSync).mockImplementation(() => {
    return true
  })

const mockReadFileSyncSuccess = () =>
  vi.mocked(readFileSync).mockImplementation(() => {
    return 'file'
  })
