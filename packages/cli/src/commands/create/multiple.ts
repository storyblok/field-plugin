import { existsSync, unlinkSync } from 'fs'
import fse from 'fs-extra'
import { bold, cyan, red } from 'kleur/colors'
import { resolve } from 'path'
import { MONOREPO_FOLDER_NAME, TEMPLATES_PATH } from '../../../config'
import { initializeNewRepo, runCommand } from '../../utils'
import { add, Template } from '../add'

type CreateMonorepoFunc = (args: {
  dir: string
  name?: string
  template?: Template
}) => Promise<void>

const getPossibleFolderName = (dir: string) => {
  if (!existsSync(resolve(dir, MONOREPO_FOLDER_NAME))) {
    return MONOREPO_FOLDER_NAME
  }
  // eslint-disable-next-line functional/no-loop-statement, functional/no-let
  for (let count = 2; count < 100; count++) {
    const postfix = `-${count}`
    if (!existsSync(resolve(dir, `${MONOREPO_FOLDER_NAME}${postfix}`))) {
      return `${MONOREPO_FOLDER_NAME}${postfix}`
    }
  }
  console.log(
    bold(red('[ERROR]')),
    `The folder \`${MONOREPO_FOLDER_NAME}\` already exists.`,
  )
  process.exit(1)
}

export const createMonorepo: CreateMonorepoFunc = async ({
  dir,
  name,
  template,
}) => {
  const folderName = getPossibleFolderName(dir)
  const repoDir = resolve(dir, folderName)

  console.log(bold(cyan('[info] Creating a repository at the following path:')))
  console.log(`  > ${repoDir}`)
  fse.copySync(resolve(TEMPLATES_PATH, 'monorepo'), repoDir)

  console.log(bold(cyan('[info] Running `yarn install`...')))
  console.log((await runCommand(`yarn --version`, { cwd: repoDir })).stdout)
  await runCommand(`yarn install`, { cwd: repoDir })

  console.log(bold(cyan('[info] Creating the first field-plugin...')))
  //TODO: make more customizable
  await add({
    dir: `${repoDir}/packages`,
    structure: 'multiple',
    name,
    template,
  })
  unlinkSync(`${repoDir}/packages/.gitkeep`)
  await initializeNewRepo({ dir: repoDir })
}
