#!/usr/bin/env zx

import { $ } from 'zx'

const helpers = ['react', 'vue3', 'vite']

// eslint-disable-next-line functional/no-loop-statement
for (const helper of helpers) {
  await $`mkdir -p ./packages/field-plugin/dist/${helper}`
  await $`cp -r ./packages/field-plugin/helpers/${helper}/dist/* ./packages/field-plugin/dist/${helper}`
}
