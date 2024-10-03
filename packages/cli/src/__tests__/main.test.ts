import { createCLI } from '../main'
import { create, add, deploy } from '../commands'
import { vi } from 'vitest'

vi.mock('../commands')

const DEFAULT_ARGS = ['node', 'main.ts'] // cli.parse() should receive the executable and its arget as its first two arguments.

describe('main', () => {
  describe('default arguments', () => {
    it('create command', () => {
      const cli = createCLI()
      cli.parse([...DEFAULT_ARGS, 'create'])
      expect(create).toHaveBeenCalledWith({ dir: '.' })
    })

    it('add command', () => {
      const cli = createCLI()
      cli.parse([...DEFAULT_ARGS, 'add'])
      expect(add).toHaveBeenCalledWith({ dir: '.' })
    })

    it('deploy command', () => {
      const cli = createCLI()
      cli.parse([...DEFAULT_ARGS, 'deploy'])
      expect(deploy).toHaveBeenCalledWith({
        dir: '.',
        skipPrompts: false,
        publish: true,
      })
    })
  })

  describe('full arguments', () => {
    it('create command', () => {
      const cli = createCLI()
      cli.parse([
        ...DEFAULT_ARGS,
        'create',
        '--dir',
        'my-dir',
        '--structure',
        'monorepo',
        '--pluginName',
        'my-test-plugin',
        '--repoName',
        'my-test-repo',
      ])
      expect(create).toHaveBeenCalledWith({
        dir: 'my-dir',
        structure: 'monorepo',
        pluginName: 'my-test-plugin',
        repoName: 'my-test-repo',
      })
    })

    it('add command', () => {
      const cli = createCLI()
      cli.parse([
        ...DEFAULT_ARGS,
        'add',
        '--template',
        'react',
        '--name',
        'my-test-plugin',
        '--dir',
        'my-directory',
        '--structure',
        'standalone',
        '--packageManager',
        'npm',
      ])
      expect(add).toHaveBeenCalledWith({
        template: 'react',
        name: 'my-test-plugin',
        dir: 'my-directory',
        structure: 'standalone',
        packageManager: 'npm',
      })
    })

    it('deploy command', () => {
      const cli = createCLI()
      cli.parse([
        ...DEFAULT_ARGS,
        'deploy',
        '--token',
        'test-token',
        '--skipPrompts',
        '--name',
        'my-test-plugin',
        '--output',
        './dist/index.js',
        '--dir',
        'my-directory',
        '--dotEnvPath',
        '.',
        '--scope',
        'my-plugins',
      ])
      expect(deploy).toHaveBeenCalledWith({
        token: 'test-token',
        skipPrompts: true,
        name: 'my-test-plugin',
        output: './dist/index.js',
        dir: 'my-directory',
        publish: true,
        dotEnvPath: '.',
        scope: 'my-plugins',
      })
    })
  })
})
