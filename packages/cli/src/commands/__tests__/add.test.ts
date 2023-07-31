import { readdir, readFile } from 'fs/promises'
import tempDir from 'temp-dir'
import { add } from '../add'
import { randomString } from '../../utils'
import { vi } from 'vitest'

vi.mock('../../utils', async () => {
  const actualUtils = await vi.importActual<typeof import('../../utils')>(
    '../../utils',
  )

  return {
    ...actualUtils,
    runCommand: vi.fn(() => ({ stdout: '' })),
  }
})

describe('add', () => {
  it('adds a standalone template', async () => {
    const folderName = randomString()
    const name = randomString()
    const dir = `${tempDir}/${folderName}`
    await add({
      dir,
      packageManager: 'npm',
      name,
      template: 'react',
      structure: 'standalone',
    })
    const files = await readdir(`${dir}/${name}`)
    expect(files).toContain('.env.local.example')
    expect(files).toMatchInlineSnapshot(`
      [
        ".env.local.example",
        ".eslintrc.cjs",
        ".gitignore",
        ".nvmrc",
        ".prettierrc",
        "README.md",
        "dist",
        "index.html",
        "package.json",
        "src",
        "tsconfig.json",
        "tsconfig.node.json",
        "vite.config.ts",
      ]
    `)
  })

  it('adds a monorepo template', async () => {
    const folderName = randomString()
    const name = randomString()
    const dir = `${tempDir}/${folderName}`
    await add({
      dir,
      packageManager: 'npm',
      name,
      template: 'react',
      structure: 'monorepo',
    })
    const files = await readdir(`${dir}/${name}`)

    expect(files).not.toContain('.env.local.example')

    const packageJson = JSON.parse(
      (await readFile(`${dir}/${name}/package.json`)).toString(),
    )
    expect(packageJson['scripts']['deploy']).toMatchInlineSnapshot(
      '"npm run build && npx @storyblok/field-plugin-cli@beta deploy --dotEnvPath \'../../.env\'"',
    )
    expect(files).toMatchInlineSnapshot(`
      [
        ".eslintrc.cjs",
        ".gitignore",
        ".nvmrc",
        ".prettierrc",
        "README.md",
        "dist",
        "index.html",
        "package.json",
        "src",
        "tsconfig.json",
        "tsconfig.node.json",
        "vite.config.ts",
      ]
    `)
  })
})
