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

import { $ } from 'zx'
import fs from 'fs/promises'
import path from 'path'

process.env.FORCE_COLOR = '1'

const templates = (
  await fs.readdir('packages/cli/templates', { withFileTypes: true })
)
  .filter((dir) => dir.isDirectory() && dir.name !== 'monorepo')
  .map((dir) => dir.name)

for (const template of templates) {
  const templatePath = `packages/cli/templates/${template}`
  const newConfigDir = `${templatePath}/node_modules`
  const newConfigPath = `${newConfigDir}/.${template}-vite.config.ts`
  await $`mkdir -p ${newConfigDir}`
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
    }, {
      find: /^@storyblok\\/field-plugin\\/vue3$/,
      replacement: '${path.resolve(
        __dirname,
        '../packages/lib-helpers/vue3/src/index.ts',
      )}'
    }, {
      find: /^@storyblok\\/field-plugin\\/react$/,
      replacement: '${path.resolve(
        __dirname,
        '../packages/lib-helpers/react/src/index.ts',
      )}'
    }]
  },
  plugins:`,
  )

  await fs.writeFile(newConfigPath, file)
}
