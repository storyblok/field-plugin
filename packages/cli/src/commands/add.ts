import { bold, cyan, red, green } from 'kleur/colors'
import { resolve, dirname, relative } from 'path'
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import walk from 'walkdir'
import { MONOREPO_TEMPLATE_PATH, TEMPLATES_PATH } from '../../config'
import {
  checkIfSubDir,
  filterPathsToInclude,
  getInstallCommand,
  getMonorepoCommandByPackageManager,
  getStandaloneCommandByPackageManager,
  isValidPackageManager,
  promptName,
  runCommand,
  selectPackageManager,
  selectTemplate,
} from '../utils'
import type { PackageManager, Structure, Template } from './types'

export type AddArgs = {
  dir: string
  packageManager: PackageManager
  name?: string
  template?: Template
  structure?: Structure
}

export type PackageJson = {
  name: string
  scripts: {
    deploy: string
  }
}

export type AddFunc = (args: AddArgs) => Promise<{ destPath: string }>

export const add: AddFunc = async (args) => {
  const packageManager = isValidPackageManager(args.packageManager)
    ? args.packageManager
    : await selectPackageManager()

  const structure = args.structure || 'standalone'

  console.log(bold(cyan('\nWelcome!')))
  console.log("Let's create a field-type extension.\n")

  const packageName =
    typeof args.name !== 'undefined' && args.name !== ''
      ? args.name
      : await promptName({
          message:
            'What is your package name?\n  (Lowercase alphanumeric and dash are allowed.)',
        })

  const template =
    typeof args.template !== 'undefined'
      ? args.template
      : await selectTemplate()
  const rootPath = resolve(args.dir)
  const destPath = resolve(rootPath, packageName)
  const templatePath = resolve(TEMPLATES_PATH, template) + '/'
  const repoRootPath =
    structure === 'monorepo' ? resolve(rootPath, '..') : destPath

  if (!existsSync(templatePath)) {
    console.log(
      bold(red('[ERROR]')),
      `The template '${template}' is not found.`,
    )
    process.exit(1)
  }

  walk.sync(templatePath, { filter: filterPathsToInclude }, (file, stat) => {
    if (!stat.isFile()) {
      return
    }

    const destFilePath = resolve(destPath, file.slice(templatePath.length))
    mkdirSync(dirname(destFilePath), {
      recursive: true,
    })

    if (file === resolve(templatePath, 'package.json')) {
      const packageJson = JSON.parse(
        readFileSync(file).toString(),
      ) as PackageJson

      packageJson['name'] = packageName

      if (args.structure === 'monorepo') {
        packageJson['scripts']['deploy'] += " --dotEnvPath '../../.env'"
      }

      writeFileSync(destFilePath, JSON.stringify(packageJson, null, 2))
      return
    }

    if (file === resolve(templatePath, 'gitignore')) {
      const destGitIgnore = resolve(destPath, `.gitignore`)
      copyFileSync(file, destGitIgnore)
      return
    }

    copyFileSync(file, destFilePath)
  })

  if (structure === 'standalone') {
    // Standalone gets .env.local.example copied from the monorepo template.
    copyFileSync(
      resolve(MONOREPO_TEMPLATE_PATH, '.env.local.example'),
      resolve(destPath, '.env.local.example'),
    )
  }

  const installCommand = getInstallCommand(packageManager)
  await runCommand(installCommand, {
    cwd: destPath,
    spinnerMessage: `Running \`${installCommand}\`..`,
  })

  const relativePath = getRelativePath(repoRootPath)

  console.log(bold(cyan(`\n\nYour project \`${packageName}\` is ready 🚀\n`)))
  console.log(`- To run development mode run the following commands:`)
  console.log(`    >`, green(`cd ${relativePath}`))

  if (structure === 'standalone') {
    console.log(
      `    >`,
      green(
        getStandaloneCommandByPackageManager({
          packageManager,
          commandName: 'dev',
        }),
      ),
    )
  } else if (structure === 'monorepo') {
    console.log(
      `    >`,
      green(
        getMonorepoCommandByPackageManager({
          packageManager,
          commandName: 'dev',
          packageName,
        }),
      ),
    )
  }

  console.log(`\n\n- To deploy the newly created field plugin to Storyblok:`)
  console.log(`    >`, green(`cd ${relativePath}`))
  if (structure === 'standalone') {
    console.log(
      `    >`,
      green(
        getStandaloneCommandByPackageManager({
          packageManager,
          commandName: 'deploy',
        }),
      ),
    )
  } else if (structure === 'monorepo') {
    console.log(
      `    >`,
      green(
        getMonorepoCommandByPackageManager({
          packageManager,
          commandName: 'deploy',
          packageName,
        }),
      ),
    )
  }
  return { destPath }
}

const getRelativePath = (rootPath: string) =>
  checkIfSubDir(process.cwd(), rootPath)
    ? relative(process.cwd(), rootPath)
    : rootPath
