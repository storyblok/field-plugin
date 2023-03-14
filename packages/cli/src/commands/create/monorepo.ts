import { copyFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { bold, cyan, red } from 'kleur/colors'
import { dirname, resolve } from 'path'
import { MONOREPO_FOLDER_NAME, TEMPLATES_PATH } from '../../../config'
import {
  getIncludedPathsFilter,
  initializeNewRepo,
  runCommand,
} from '../../utils'
import { add, Template } from '../add'
import walk from 'walkdir'

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
  const templatePath = resolve(TEMPLATES_PATH, 'monorepo') + '/'

  console.log(bold(cyan('[info] Creating a repository at the following path:')))
  console.log(`  > ${repoDir}`)

  //TODO: make reusable with code inside add command
  walk.sync(templatePath, { filter: getIncludedPathsFilter }, (file, stat) => {
    if (!stat.isFile()) {
      return
    }

    //TODO: clarify why?
    const destFilePath = resolve(repoDir, file.slice(templatePath.length))

    mkdirSync(dirname(destFilePath), {
      recursive: true,
    })

    if (file === resolve(templatePath, 'gitignore')) {
      const destGitIgnore = resolve(repoDir, `.gitignore`)
      copyFileSync(file, destGitIgnore)
      return
    }
    copyFileSync(file, destFilePath)
  })

  console.log(bold(cyan('[info] Running `yarn install`...')))
  await runCommand(`yarn install`, { cwd: repoDir })

  console.log(bold(cyan('[info] Creating the first field-plugin...')))
  await add({
    dir: `${repoDir}/packages`,
    structure: 'monorepo',
    name,
    template,
  })
  unlinkSync(`${repoDir}/packages/.gitkeep`)
  await initializeNewRepo({ dir: repoDir })
}
