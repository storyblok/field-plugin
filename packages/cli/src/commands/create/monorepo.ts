import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import { bold, cyan } from 'kleur/colors'
import { dirname, resolve, basename } from 'path'
import { MONOREPO_TEMPLATE_PATH } from '../../../config'
import {
  betterPrompts,
  filterPathsToInclude,
  initializeNewRepo,
} from '../../utils'
import { add } from '../add'
import walk from 'walkdir'
import { CreateMonorepoFunc } from './types'
import { PackageManager } from '../types'

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

const specifyPackageManager = ({
  packageManager,
  repoDir,
}: {
  packageManager: PackageManager
  repoDir: string
}) => {
  if (packageManager === 'yarn' || packageManager === 'pnpm') {
    const json = JSON.parse(
      readFileSync(resolve(repoDir, 'package.json')).toString(),
    ) as Record<string, unknown> & { scripts: Record<string, string> }

    json['scripts']['add-plugin'] += ` --packageManager ${packageManager}`
    json['packageManager'] =
      packageManager === 'yarn' ? 'yarn@3.2.4' : 'pnpm@8.14.0'

    writeFileSync(
      resolve(repoDir, 'package.json'),
      JSON.stringify(json, null, 2),
    )
  }
}

const MONOREPO_DOCS: Record<PackageManager, string> = {
  npm: 'https://docs.npmjs.com/cli/v7/using-npm/workspaces',
  yarn: 'https://yarnpkg.com/features/workspaces',
  pnpm: 'https://pnpm.io/workspaces',
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

    // skip yarn files if yarn is not the package manager
    const fileBasename = basename(file)
    if (
      (fileBasename === 'yarn-3.2.4.cjs' || fileBasename === '.yarnrc.yml') &&
      packageManager !== 'yarn'
    ) {
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

  specifyPackageManager({ packageManager, repoDir })

  if (packageManager === 'pnpm') {
    writeFileSync(
      resolve(repoDir, 'pnpm-workspace.yaml'),
      `packages:\n  - 'packages/*'\n`,
    )
  }

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

  console.log('\n\n- To learn more about monorepo:')
  console.log(`    > ${MONOREPO_DOCS[packageManager]}`)
}
