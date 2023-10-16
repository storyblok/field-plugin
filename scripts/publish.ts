#!/usr/bin/env -S node_modules/.bin/tsx
// https://github.com/google/zx/issues/467#issuecomment-1577838056

import { $ } from 'zx'
import fs from 'fs/promises'
import semver from 'semver'

const packageFolder = process.argv[2] ?? ''
if (!['cli', 'field-plugin'].includes(packageFolder)) {
  console.error(
    "[ERROR] You must specify which package to publish: ('cli' | 'field-plugin')",
  )
  console.error('  > e.g. ./scripts/publish.ts cli')
  process.exit(1)
}

const { version } = JSON.parse(
  (await fs.readFile(`packages/${packageFolder}/package.json`)).toString(),
) as Record<string, string>
const prerelease = semver.prerelease(version)
const tag = prerelease ? prerelease[0] : 'latest'

await $`cd packages/${packageFolder} && npm publish --access public --tag ${tag}`
