import { defineBuildConfig } from 'unbuild'
import { execaCommand } from 'execa'
import path from 'path'

const SUBMODULES = ['react', 'vue3', 'vite', 'test']

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
  hooks: {
    'build:done': async () => copyHelpersToRootDist(),
  },
})

const copyHelpersToRootDist = async () => {
  const cwd = path.resolve(__dirname)

  for (const mod of SUBMODULES) {
    await execaCommand(`cd ../dist && mkdir -p ${mod}`, { cwd, shell: true })
    await execaCommand(`cp ./dist/${mod}/src/* ../dist/${mod}/`, {
      cwd,
      shell: true,
    })
  }
}
