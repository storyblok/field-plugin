#!/usr/bin/env zx

import fs from 'fs/promises'
import path from 'path'

const template = process.argv[3]
const templatePath = `packages/cli/templates/${template}`
const newConfigPath = `${templatePath}/node_modules/.${template}-vite.config.ts`
await $`cp ${templatePath}/vite.config.ts ${newConfigPath}`

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
