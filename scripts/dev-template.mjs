#!/usr/bin/env zx

import fs from 'fs/promises'
import path from 'path'

const template = process.argv[3]
const newConfigPath = `packages/cli/templates/${template}/node_modules/.${template}-vite.config.ts`
await $`cp packages/cli/templates/${template}/vite.config.ts ${newConfigPath}`

let file = (await fs.readFile(newConfigPath)).toString()
file = file.replace(
  'plugins:',
  `resolve: {
    alias: [{
      find: /^@storyblok\\/field-plugin$/,
      replacement: '${path.resolve(
        __dirname,
        '../packages/field-plugin/src/index.ts',
      )}'
    }]
  },
  plugins:`,
)

await fs.writeFile(newConfigPath, file)

const newConfigFullPath = path.resolve(newConfigPath)
await $`yarn workspace field-plugin-${template}-template dev --config ${newConfigFullPath}`
