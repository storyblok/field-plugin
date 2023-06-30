import {
  copyFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import { bold, cyan } from 'kleur/colors'
import { dirname, resolve } from 'path'
import { MONOREPO_TEMPLATE_PATH } from '../../../config'
import {
  betterPrompts,
  filterPathsToInclude,
  getInstallCommand,
  initializeNewRepo,
  runCommand,
} from '../../utils'
import { add } from '../add'
import walk from 'walkdir'
import { CreateMonorepoFunc } from './types'

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
  packageManager,
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

  if (packageManager === 'yarn' || packageManager === 'pnpm') {
    const value = packageManager === 'yarn' ? 'yarn@3.2.4' : 'pnpm'
    await runCommand(`npm pkg set packageManager=${value}`, {
      cwd: templatePath,
    })
  }

  if (packageManager === 'pnpm') {
    writeFileSync(
      resolve(templatePath, 'pnpm-workspace.yaml'),
      `packages:\n  - 'packages/*'\n`,
    )
  }

  const installCommand = getInstallCommand(packageManager)
  console.log(bold(cyan(`[info] Running \`${installCommand}\`...`)))
  await runCommand(installCommand, { cwd: repoDir })

  console.log(bold(cyan('[info] Creating the first field-plugin...')))
  await add({
    dir: `${repoDir}/packages`,
    packageManager,
    structure: 'monorepo',
    name: pluginName,
    template,
  })
  unlinkSync(`${repoDir}/packages/.gitkeep`)
  await initializeNewRepo({ dir: repoDir })
}
