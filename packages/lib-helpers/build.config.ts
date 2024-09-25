import { defineBuildConfig } from 'unbuild'
import { SUBMODULES } from './const'

export default defineBuildConfig({
  entries: SUBMODULES.map((mod) => `./${mod}/src/index.ts`),
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  externals: [
    'vue',
    'react',
    'react-dom',
    '@storyblok/field-plugin',
    'vite',
    'vitest',
  ],
  failOnWarn: false,
})
