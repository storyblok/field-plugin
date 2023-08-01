import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'

/*
Normally, other templates have a single build step: `vite build`. It bundles everything, including `vue` or `react`, into `dist/index.js`.

This Vue 2 template, however, has two build steps.

1. `vite build` bundles everything into `dist/temp.js`. It externalizes the `vue` dependency, meaning `dist/temp.js` does not include `vue`, but just does `import Vue from 'vue'`.

2. `npm run bundle:vue` combines `dist/temp.js` and `vue` into `dist/index.js`.

For an unknown reason, `vite build` fails to resolve and bundle `vue` into the output. That's why `vite.config.ts` has the extra `external` configuration, which excludes `vue`, so that the next step can handle it.

It may be related to `@vitejs/plugin-vue2`, but this is uncertain. Therefore, this two-step build flow is a workaround.
*/

export default {
  input: 'dist/temp.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    compact: true,
  },
  plugins: [
    nodeResolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
}
