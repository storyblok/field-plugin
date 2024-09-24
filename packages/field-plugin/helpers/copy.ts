import { SUBMODULES } from './const'
import { execaCommand } from 'execa'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const copyHelpersToFieldPluginDist = async () => {
  const cwd = resolve(dirname(fileURLToPath(import.meta.url)))
  console.log('💡 cwd', cwd)

  for (const mod of SUBMODULES) {
    await execaCommand(`cd ../dist && mkdir -p ${mod}`, { cwd, shell: true })
    await execaCommand(`cp ./dist/${mod}/src/* ../dist/${mod}/`, {
      cwd,
      shell: true,
    })
  }
}

copyHelpersToFieldPluginDist()
