import prompts from 'prompts'
import { copyFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { bold, cyan } from 'kleur/colors'
import { dirname, resolve } from 'path'
import { MONOREPO_TEMPLATE_PATH, TEMPLATES_PATH } from '../../../config'
import {
  betterPrompts,
  filterPathsToInclude,
  initializeNewRepo,
  runCommand,
} from '../../utils'
import { add, Template } from '../add'
import walk from 'walkdir'

export type CreateMonorepoArgs = {
  dir: string
  repoName?: string
  pluginName?: string
  template?: Template
}

type CreateMonorepoFunc = (args: CreateMonorepoArgs) => Promise<void>

const isValidRepoName = ({
  name,
  dir,
}: {
  name: string | undefined
  dir: string
}) => {
  return (
    typeof name === 'string' &&
    new RegExp(/^[a-z0-9\\-]+$/).test(name) &&
    !existsSync(resolve(dir, name))
  )
}

const promptRepoName = async (dir: string) => {
  const { name } = await betterPrompts<{ name: string }>([
    {
      type: 'text',
      name: 'name',
      message:
        'What is your repository name?\n  (Lowercase alphanumeric and dash are allowed.)',
      validate: (name: string) => isValidRepoName({ dir, name }),
    },
  ])
  return name
}

export const createMonorepo: CreateMonorepoFunc = async ({
  dir,
  repoName,
  pluginName,
  template,
}) => {
  const folderName =
    repoName !== undefined && isValidRepoName({ dir, name: repoName })
      ? repoName
      : await promptRepoName(dir)
  const repoDir = resolve(dir, folderName)
  const templatePath = MONOREPO_TEMPLATE_PATH + '/'

  console.log(bold(cyan('[info] Creating a repository at the following path:')))
  console.log(`  > ${repoDir}`)

  //TODO: make reusable with code inside add command
  walk.sync(templatePath, { filter: filterPathsToInclude }, (file, stat) => {
    if (!stat.isFile()) {
      return
    }

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
    name: pluginName,
    template,
  })
  unlinkSync(`${repoDir}/packages/.gitkeep`)
  await initializeNewRepo({ dir: repoDir })
}
