import prompts from 'prompts'
import { copyFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { bold, cyan } from 'kleur/colors'
import { dirname, resolve } from 'path'
import { TEMPLATES_PATH } from '../../../config'
import {
  filterPathsToInclude,
  initializeNewRepo,
  runCommand,
} from '../../utils'
import { add, Template } from '../add'
import walk from 'walkdir'

type CreateMonorepoFunc = (args: {
  dir: string
  repoName?: string
  packageName?: string
  template?: Template
}) => Promise<void>

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
  const { name } = (await prompts(
    [
      {
        type: 'text',
        name: 'name',
        message:
          'What is your repository name?\n  (Lowercase alphanumeric and dash are allowed.)',
        validate: (name: string) => isValidRepoName({ dir, name }),
      },
    ],
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )) as { name: string }
  return name
}

export const createMonorepo: CreateMonorepoFunc = async ({
  dir,
  repoName,
  packageName,
  template,
}) => {
  const folderName =
    repoName !== undefined && isValidRepoName({ dir, name: repoName })
      ? repoName
      : await promptRepoName(dir)
  const repoDir = resolve(dir, folderName)
  const templatePath = resolve(TEMPLATES_PATH, 'monorepo') + '/'

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
    name: packageName,
    template,
  })
  unlinkSync(`${repoDir}/packages/.gitkeep`)
  await initializeNewRepo({ dir: repoDir })
}
