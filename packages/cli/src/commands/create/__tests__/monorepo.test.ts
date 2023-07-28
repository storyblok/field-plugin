import { readdir } from 'fs/promises'
import tempDir from 'temp-dir'
import { add } from '../../add'
import { createMonorepo } from '../monorepo'
import { vi } from 'vitest'

vi.mock('../../add')

const randomString = (length = 16) => {
  // eslint-disable-next-line functional/no-let
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789-'
  const charactersLength = characters.length
  // eslint-disable-next-line functional/no-let
  let counter = 0
  // eslint-disable-next-line functional/no-loop-statement
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

const createMonorepoSilently = async () => {
  const repoName = randomString()
  const pluginName = randomString()
  const dir = tempDir

  await createMonorepo({
    dir,
    packageManager: 'npm',
    repoName,
    pluginName,
    template: 'react',
  })

  return { repoName, pluginName, dir }
}

describe('monorepo', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('creates a monorepo structure', async () => {
    const { repoName, pluginName, dir } = await createMonorepoSilently()

    expect(add).toHaveBeenCalledTimes(1)
    expect(add).toHaveBeenCalledWith({
      dir: `${dir}/${repoName}/packages`,
      name: pluginName,
      packageManager: 'npm',
      structure: 'monorepo',
      template: 'react',
    })

    expect(await readdir(`${dir}/${repoName}`)).toMatchInlineSnapshot(`
      [
        ".env.local.example",
        ".git",
        ".gitignore",
        ".nvmrc",
        ".prettierrc",
        ".yarn",
        ".yarnrc.yml",
        "package.json",
        "packages",
        "tsconfig.base.json",
        "tsconfig.node.base.json",
        "vite-env.d.ts",
      ]
    `)
  })
})
