#!/usr/bin/env zx
import fs from 'fs/promises'
import { $, spinner } from 'zx'

const file = await fs.readFile('packages/field-plugin/package.json')
const { version } = JSON.parse(file.toString())

await spinner('Updating the library version in all the templates...', () =>
  $`yarn workspaces foreach --include \"field-plugin-*-template\" --exclude "field-plugin-monorepo-template" add @storyblok/field-plugin@${version}`.quiet(),
)
