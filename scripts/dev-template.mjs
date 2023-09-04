#!/usr/bin/env zx

/*
  It's totally okay to run `yarn workspace field-plugin-react-template dev`.
  However, if you want to test changes in `@storyblok/field-plugin` library (under `packages/field-plugin/` folder),
  you must run `yarn build:lib` to reflect the change in the react template.
  To avoid this inefficiency, we can add `resolve.alias` config into `vite.config.ts` of each template.
  This will resolve the source code of the library instead of its bundle output.

  However, we don't want to put `resolve.alias` config inside of the templates,
  because the CLI uses the templates to create projects for users, and we don't want this config there.
  To avoid having this config directly inside vite config of the templates,
  this script creates a temporary config that extends the real config, adding the extra `resolve.alias` config.
  https://github.com/storyblok/field-plugin/pull/264
*/

import fs from 'fs/promises'
import path from 'path'

const template = process.argv[3]
if (!template) {
  console.error('[ERROR] This script requires a template name as an argument.')
  console.error('  > e.g. ./scripts/dev-template.mjs react')
  process.exit(1)
}
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
