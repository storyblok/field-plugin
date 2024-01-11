import { readdir } from 'fs/promises'
import tempDir from 'temp-dir'
import { add } from '../../add'
import { createMonorepo } from '../monorepo'
import { randomString } from '../../../utils'
import { vi } from 'vitest'
import { CreateMonorepoArgs } from '../types'

vi.mock('../../add')

const createMonorepoSilently = async (
  options?: Partial<Pick<CreateMonorepoArgs, 'packageManager' | 'template'>>,
) => {
  const repoName = randomString()
  const pluginName = randomString()
  const dir = tempDir

  await createMonorepo({
    dir,
    packageManager: options?.packageManager || 'npm',
    repoName,
    pluginName,
    template: options?.template || 'react',
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
        "package.json",
        "packages",
        "tsconfig.base.json",
        "tsconfig.node.base.json",
        "vite-env.d.ts",
      ]
    `)
  })

  it('creates a monorepo structure with yarn', async () => {
    const { repoName, pluginName, dir } = await createMonorepoSilently({
      packageManager: 'yarn',
    })

    expect(add).toHaveBeenCalledTimes(1)
    expect(add).toHaveBeenCalledWith({
      dir: `${dir}/${repoName}/packages`,
      name: pluginName,
      packageManager: 'yarn',
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
