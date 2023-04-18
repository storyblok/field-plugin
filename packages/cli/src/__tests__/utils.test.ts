import { existsSync } from 'fs'
import { vi } from 'vitest'
import { getPersonalAccessToken } from '../utils'

vi.mock('node:fs', () => {
  return {
    existsSync: vi.fn(),
  }
})

vi.mock('node:path', () => {
  return {
    resolve: (path: string) => `<current-directory>/${path}`,
  }
})

describe('utils', () => {
  it('tests nothing', () => {
    expect(true).toBe(true)
  })

  describe('getPersonalAccessToken (skipPrompts: true)', () => {
    it('returns token if given', async () => {
      expect(
        await getPersonalAccessToken({
          token: 'abc',
          dotEnvPath: undefined,
          skipPrompts: true,
        }),
      ).toEqual({
        token: 'abc',
      })
    })

    it('return error if the given dotEnvPath does not exist', async () => {
      vi.mocked(existsSync).mockImplementation(() => false)
      const result = await getPersonalAccessToken({
        token: undefined,
        dotEnvPath: '.env.local',
        skipPrompts: true,
      })
      expect(existsSync).toHaveBeenCalledWith('.env.local')
      expect(existsSync).toHaveBeenCalledTimes(1)

      expect(result).toEqual({
        error: true,
        message:
          "Environment variable file doesn't exist at the following path:" +
          '\n  > <current-directory>/.env.local',
      })
    })

    describe('dotEnvPath is given', () => {
      it('returns error if env file does not have token', async () => {
        vi.mocked(existsSync).mockImplementation(() => true)
        // eslint-disable-next-line functional/immutable-data
        delete process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
        const result = await getPersonalAccessToken({
          token: undefined,
          dotEnvPath: '.env.local',
          skipPrompts: true,
        })
        expect(result).toEqual({
          error: true,
          message:
            "Could't find the environment variable `STORYBLOK_PERSONAL_ACCESS_TOKEN` at the following paths:" +
            '\n  > <current-directory>/.env.local',
        })
      })

      it('returns token if env file has token', async () => {
        vi.mocked(existsSync).mockImplementation(() => true)
        // eslint-disable-next-line functional/immutable-data
        process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN = 'my-token'
        const result = await getPersonalAccessToken({
          token: undefined,
          dotEnvPath: '.env.local',
          skipPrompts: true,
        })
        expect(result).toEqual({
          token: 'my-token',
        })
      })
    })

    describe('dotEnvPath is not given', () => {
      it('returns error if env files do not have token', async () => {
        vi.mocked(existsSync).mockImplementation(() => true)
        // eslint-disable-next-line functional/immutable-data
        delete process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
        const result = await getPersonalAccessToken({
          token: undefined,
          dotEnvPath: undefined,
          skipPrompts: true,
        })
        expect(result).toEqual({
          error: true,
          message:
            "Could't find the environment variable `STORYBLOK_PERSONAL_ACCESS_TOKEN` at the following paths:" +
            '\n  > <current-directory>/.env' +
            '\n  > <current-directory>/.env.local',
        })
      })

      it('returns token if env files have token', async () => {
        vi.mocked(existsSync).mockImplementation(() => true)
        // eslint-disable-next-line functional/immutable-data
        process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN = 'my-token'
        const result = await getPersonalAccessToken({
          token: undefined,
          dotEnvPath: undefined,
          skipPrompts: true,
        })
        expect(result).toEqual({
          token: 'my-token',
        })
      })
    })
  })
})
